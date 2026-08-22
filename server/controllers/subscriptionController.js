import Razorpay from "razorpay";
import crypto from "crypto";
import Subscription from "../models/subscriptionModal.js";
import Users from "../models/userModel.js";
import { errorResponse, successResponse } from "../utils/apiResponse.js";
import { StatusCodes } from "http-status-codes";
import { getPlanById } from "../utils/getPlanDetails.js";
import getDaysRemaining from "../utils/getDayRemaining.js";
import Folder from "../models/folderModel.js";
import redisClient from "../db/redisDB.js";
import { disableUserService, enableUserService } from "../utils/serviceControl.js";
import { sendEventToUser } from "./eventController.js";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const createSubscription = async (req, res, next) => {
  try {
    const { planId } = req.body;
    const user = req.user;

    const validPlan = getPlanById(planId);
    if (!validPlan) {
      return errorResponse(
        res,
        StatusCodes.BAD_REQUEST,
        "Plan ID is not valid",
      );
    }

    if (planId === "free") {
      return errorResponse(
        res,
        StatusCodes.BAD_REQUEST,
        "Use free plan activation endpoint for free tier",
      );
    }

    const oldSubscription = await Subscription.findOne({ userId: user._id });

    if (oldSubscription) {
      if (oldSubscription.status === "active" && oldSubscription.planId === planId) {
        return errorResponse(
          res,
          StatusCodes.BAD_REQUEST,
          "You already have an active subscription for this plan",
        );
      }

      if (
        oldSubscription.planId === planId &&
        oldSubscription.status === "created"
      ) {
        return successResponse(res, StatusCodes.OK, {
          subscriptionId: oldSubscription.subscriptions_id,
        });
      }

      if (
        oldSubscription.status === "created" ||
        oldSubscription.status === "cancelled" ||
        oldSubscription.status === "paused" ||
        oldSubscription.status === "active"
      ) {
        if (oldSubscription.status === "created" || oldSubscription.status === "active") {
          try {
            await razorpay.subscriptions.cancel(oldSubscription.subscriptions_id, false);
          } catch (cancelError) {
            console.warn("Notice: Could not cancel old Razorpay sub:", cancelError.message);
          }
        }

        const subscription = await razorpay.subscriptions.create({
          plan_id: planId,
          total_count: 120,
          notes: {
            userId: user._id.toString(),
            userEmail: user.email,
          },
        });

        oldSubscription.planId = subscription.plan_id;
        oldSubscription.subscriptions_id = subscription.id;
        oldSubscription.status = "created";
        oldSubscription.pausedAt = null;
        oldSubscription.cancelledAt = null;
        oldSubscription.resumeAt = null;
        await oldSubscription.save();

        return successResponse(res, StatusCodes.CREATED, {
          subscriptionId: subscription.id,
        });
      }
    }

    const newSubscription = await razorpay.subscriptions.create({
      plan_id: planId,
      total_count: 120,
      notes: {
        userId: user._id.toString(),
        userEmail: user.email,
      },
    });

    await Subscription.create({
      subscriptions_id: newSubscription.id,
      planId: planId,
      status: "created",
      userId: user._id,
      createdAt: new Date(),
    });

    return successResponse(res, StatusCodes.CREATED, {
      subscriptionId: newSubscription.id,
    });
  } catch (error) {
    console.error("CreateSubscription error:", error);
    next(error);
  }
};

export const verifySubscription = async (req, res, next) => {
  try {
    const {
      razorpay_payment_id,
      razorpay_subscription_id,
      razorpay_signature,
    } = req.body;
    const user = req.user;

    if (!razorpay_subscription_id) {
      return errorResponse(
        res,
        StatusCodes.BAD_REQUEST,
        "Missing subscription ID",
      );
    }

    // Verify signature if provided
    if (razorpay_payment_id && razorpay_signature) {
      const generatedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(`${razorpay_payment_id}|${razorpay_subscription_id}`)
        .digest("hex");

      if (generatedSignature !== razorpay_signature) {
        console.error("[Verify Subscription] Signature mismatch");
        return errorResponse(
          res,
          StatusCodes.BAD_REQUEST,
          "Invalid payment signature",
        );
      }
    }

    // Fetch subscription details from Razorpay
    let rzpSub = null;
    try {
      rzpSub = await razorpay.subscriptions.fetch(razorpay_subscription_id);
    } catch (fetchErr) {
      console.warn("Could not fetch Razorpay subscription:", fetchErr.message);
    }

    let subscription = await Subscription.findOne({
      subscriptions_id: razorpay_subscription_id,
      userId: user._id,
    });

    if (!subscription) {
      subscription = await Subscription.findOne({ userId: user._id });
    }

    const planId = rzpSub?.plan_id || subscription?.planId;
    const planDetails = getPlanById(planId);
    const now = new Date();

    const currentStart = rzpSub?.current_start
      ? new Date(rzpSub.current_start * 1000)
      : now;
    const currentEnd = rzpSub?.current_end
      ? new Date(rzpSub.current_end * 1000)
      : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    if (subscription) {
      subscription.subscriptions_id = razorpay_subscription_id;
      subscription.planId = planId;
      subscription.status = "active";
      subscription.currentStart = currentStart;
      subscription.currentEnd = currentEnd;
      subscription.startAt = rzpSub?.start_at ? new Date(rzpSub.start_at * 1000) : now;
      subscription.endAt = rzpSub?.end_at ? new Date(rzpSub.end_at * 1000) : null;
      subscription.pausedAt = null;
      subscription.cancelledAt = null;
      await subscription.save();
    } else {
      subscription = await Subscription.create({
        subscriptions_id: razorpay_subscription_id,
        planId: planId,
        status: "active",
        userId: user._id,
        currentStart,
        currentEnd,
        startAt: now,
      });
    }

    const dbUser = await Users.findById(user._id);
    dbUser.subscriptionsId = razorpay_subscription_id;
    if (planDetails) {
      dbUser.maxStorageLimite = planDetails.storageBytes;
      dbUser.maxDeviceLimit = planDetails.maxDevices;
      dbUser.maxFileSize = planDetails.maxFileSizeBytes;
      dbUser.restoreFileDays = planDetails.restoreFileDays;
    }
    await dbUser.save();

    try {
      sendEventToUser(user._id.toString(), {
        type: "subscriptionActivated",
        txnId: razorpay_payment_id || razorpay_subscription_id,
        subscriptionId: razorpay_subscription_id,
      });
    } catch (sseErr) {
      console.warn("SSE trigger notice:", sseErr.message);
    }

    return successResponse(res, StatusCodes.OK, {
      message: "Subscription verified and activated successfully",
      subscription: {
        id: subscription.subscriptions_id,
        status: subscription.status,
        planId: subscription.planId,
        planName: planDetails?.name || "Premium Plan",
      },
    });
  } catch (error) {
    console.error("VerifySubscription error:", error);
    next(error);
  }
};

export const activateFreePlan = async (req, res, next) => {
  try {
    const user = req.user;
    const existingSub = await Subscription.findOne({ userId: user._id });

    if (existingSub && existingSub.status === "active") {
      try {
        await razorpay.subscriptions.cancel(existingSub.subscriptions_id, false);
      } catch (err) {
        console.warn("Notice: Cancel Razorpay sub during free activation:", err.message);
      }
      existingSub.status = "cancelled";
      existingSub.cancelledAt = new Date();
      await existingSub.save();
    }

    await disableUserService(user._id, "Free plan selected");

    const dbUser = await Users.findById(user._id);
    dbUser.subscriptionsId = null;
    await dbUser.save();

    return successResponse(res, StatusCodes.OK, {
      message: "Free plan activated successfully",
    });
  } catch (error) {
    console.error("ActivateFreePlan error:", error);
    next(error);
  }
};

export const subscriptionStatus = async (req, res, next) => {
  try {
    const user = req.user;
    let subscription = null;

    if (user.subscriptionsId) {
      subscription = await Subscription.findOne({
        userId: user._id,
        subscriptions_id: user.subscriptionsId,
      });
    }

    if (!subscription) {
      subscription = await Subscription.findOne({ userId: user._id }).sort({ updatedAt: -1 });
    }

    const rootFolderSize = await Folder.findById(user.rootFolderId)
      .select("size")
      .lean();

    let connectedDevices = 1;
    try {
      const activeSession = await redisClient.ft.search(
        "userIdx",
        `@userId:{${user._id}}`,
      );
      connectedDevices = activeSession?.total || 1;
    } catch (redisErr) {
      console.warn("Redis session query notice:", redisErr.message);
    }

    const isFreeOrNone = !subscription || subscription.status === "cancelled";
    const currentStatus = subscription ? subscription.status : "free";
    const planDetails = getPlanById(subscription?.planId || "free") || getPlanById("free");

    let invoiceList = [];
    if (subscription?.subscriptions_id) {
      try {
        const invoices = await razorpay.invoices.all({
          subscription_id: subscription.subscriptions_id,
        });
        if (invoices?.items) {
          invoiceList = invoices.items.map(
            ({ id, status, paid_at, amount_paid, short_url }) => ({
              id,
              status,
              paid_at: paid_at || Math.floor(Date.now() / 1000),
              amount_paid: amount_paid || (planDetails.price * 100),
              short_url: short_url || null,
              planName: planDetails.name,
            }),
          );
        }
      } catch (invError) {
        console.warn("Could not fetch invoices from Razorpay:", invError.message);
      }
    }

    return successResponse(res, StatusCodes.OK, {
      subscription: {
        status: currentStatus,
        pausedAt: subscription?.pausedAt || null,
        planId: planDetails.id,
        planName: planDetails.name,
        planPrice: planDetails.price,
        billingCycle: planDetails.billingCycle || "Monthly",
        nextBillingDate: subscription?.currentEnd || null,
        currentBillingDate: subscription?.currentStart || user.createdAt,
        daysUntilRenewal: subscription?.currentEnd,
        invoice: invoiceList,
        user: {
          maxFileUploadSize: user.maxFileSize,
          usedStorage: rootFolderSize || { size: 0 },
          totalStorage: user.maxStorageLimite,
          devicesConnected: connectedDevices,
          maxDeviceLimit: user.maxDeviceLimit,
          fileRestoreTime: user.restoreFileDays,
        },
      },
    });
  } catch (error) {
    console.error("SubscriptionStatus error:", error);
    next(error);
  }
};

export const subscriptionPaused = async (req, res, next) => {
  try {
    const user = req.user;
    const subscription = await Subscription.findOne({
      userId: user._id,
      status: "active",
    });

    if (!subscription) {
      return errorResponse(
        res,
        StatusCodes.NOT_FOUND,
        "Active subscription not found to pause",
      );
    }

    try {
      await razorpay.subscriptions.pause(subscription.subscriptions_id, {
        pause_at: "now",
      });
    } catch (rzpErr) {
      console.warn("Razorpay pause API notice:", rzpErr.message);
    }

    subscription.status = "paused";
    subscription.pausedAt = new Date();
    await subscription.save();

    await disableUserService(user._id, "Subscription paused by user");

    try {
      sendEventToUser(user._id.toString(), {
        type: "subscriptionPaused",
        subscriptionId: subscription.subscriptions_id,
      });
    } catch (sseErr) {
      console.warn("SSE notice:", sseErr.message);
    }

    return successResponse(res, StatusCodes.OK, "Subscription successfully paused");
  } catch (error) {
    console.error("SubscriptionPaused error:", error);
    next(error);
  }
};

export const subscriptionResumed = async (req, res, next) => {
  try {
    const user = req.user;
    const subscription = await Subscription.findOne({
      userId: user._id,
      status: "paused",
    });

    if (!subscription) {
      return errorResponse(
        res,
        StatusCodes.NOT_FOUND,
        "Paused subscription not found to resume",
      );
    }

    try {
      await razorpay.subscriptions.resume(subscription.subscriptions_id, {
        resume_at: "now",
      });
    } catch (rzpErr) {
      console.warn("Razorpay resume API notice:", rzpErr.message);
    }

    subscription.status = "active";
    subscription.resumeAt = new Date();
    subscription.pausedAt = null;
    await subscription.save();

    await enableUserService(user._id, subscription.planId, "Subscription resumed by user");

    try {
      sendEventToUser(user._id.toString(), {
        type: "subscriptionResumed",
        subscriptionId: subscription.subscriptions_id,
      });
    } catch (sseErr) {
      console.warn("SSE notice:", sseErr.message);
    }

    return successResponse(res, StatusCodes.OK, "Subscription successfully resumed");
  } catch (error) {
    console.error("SubscriptionResumed error:", error);
    next(error);
  }
};

export const subscriptionCancel = async (req, res, next) => {
  try {
    const user = req.user;
    const subscription = await Subscription.findOne({
      userId: user._id,
      status: { $in: ["active", "paused", "created"] },
    });

    if (!subscription) {
      return errorResponse(
        res,
        StatusCodes.NOT_FOUND,
        "No active or paused subscription found to cancel",
      );
    }

    try {
      await razorpay.subscriptions.cancel(subscription.subscriptions_id, false);
    } catch (rzpErr) {
      console.warn("Razorpay cancel API notice:", rzpErr.message);
    }

    subscription.status = "cancelled";
    subscription.cancelledAt = new Date();
    await subscription.save();

    await disableUserService(user._id, "Subscription cancelled by user");

    const dbUser = await Users.findById(user._id);
    dbUser.subscriptionsId = null;
    await dbUser.save();

    try {
      sendEventToUser(user._id.toString(), {
        type: "subscriptionCancelled",
        subscriptionId: subscription.subscriptions_id,
      });
    } catch (sseErr) {
      console.warn("SSE notice:", sseErr.message);
    }

    return successResponse(res, StatusCodes.OK, "Subscription successfully cancelled");
  } catch (error) {
    console.error("SubscriptionCancel error:", error);
    next(error);
  }
};


