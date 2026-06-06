import Razoray from "razorpay";
import Subscription from "../models/subscriptionModal.js";
import { errorResponse, successResponse } from "../utils/apiResponse.js";
import { StatusCodes } from "http-status-codes";
import { getPlanById } from "../utils/getPlanDetails.js";
import getDaysRemaining from "../utils/getDayRemaining.js";
import Folder from "../models/folderModel.js";
import redisClient from "../db/redisDB.js";

const razorpay = new Razoray({
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

    const oldSubscription = await Subscription.findOne({ userId: user._id });

    if (oldSubscription) {
      if (oldSubscription.status === "active") {
        return errorResponse(
          res,
          StatusCodes.BAD_REQUEST,
          "You already have an active subscription",
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
        oldSubscription.planId !== planId &&
        oldSubscription.status === "created"
      ) {
        try {
          await razorpay.subscriptions.cancel(oldSubscription.subscriptions_id);
        } catch (cancelError) {
          console.error("Error canceling old subscription:", cancelError);
        }

        const subscription = await razorpay.subscriptions.create({
          plan_id: planId,
          total_count: 120,
          notes: {
            userId: user._id.toString(),
            userEmail: user.email,
          },
        });

        await Subscription.findByIdAndUpdate(oldSubscription._id, {
          planId: subscription.plan_id,
          subscriptions_id: subscription.id,
          status: "created",
          createdAt: new Date(),
        });

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

    const dbSubscription = await Subscription.create({
      subscriptions_id: newSubscription.id,
      planId: planId,
      status: "created",
      userId: user._id,
      createdAt: new Date(),
    });

    console.log("Subscription created in DB:", dbSubscription);

    return successResponse(res, StatusCodes.CREATED, {
      subscriptionId: newSubscription.id,
    });
  } catch (error) {
    console.error("CreateSubscription error:", error);
    next(error);
  }
};

export const subscriptionStatus = async (req, res, next) => {
  try {
    const user = req.user;
    const subscription = await Subscription.findOne({
      userId: user._id,
      subscriptions_id: user.subscriptionsId,
    });
    if (!subscription) {
      return errorResponse(
        res,
        StatusCodes.NOT_FOUND,
        "subscription not found for this user",
      );
    }
    const rootFolderSize = await Folder.findById(user.rootFolderId)
      .select("size")
      .lean();

    const activeSession = await redisClient.ft.search(
      "userIdx",
      `@userId:{${user._id}}`,
    );

    const invoices = await razorpay.invoices.all({
      subscription_id: user.subscriptionsId,
    });
    const planDetails = getPlanById(subscription.planId || "free");
    const invoiceList = invoices.items.map(
      ({ status, paid_at, amount_paid, short_url }) => ({
        status,
        paid_at,
        amount_paid,
        short_url,
        planName: planDetails.name,
      }),
    );

    if (!invoices) {
      return errorResponse(
        res,
        StatusCodes.BAD_REQUEST,
        "Invoice  is not found",
      );
    }

    successResponse(res, StatusCodes.OK, {
      subscription: {
        status: subscription.status,
        pausedAt: subscription.pausedAt,
        planId: subscription.planId,
        planName: planDetails.name,
        planPrice: planDetails.price,
        billingCycle: planDetails.billingCycle,
        nextBillingDate: subscription.currentEnd,
        currentBillingDate: subscription.currentStart,
        daysUntilRenewal: getDaysRemaining(subscription.currentEnd),
        invoice: invoiceList,
        user: {
          maxFileUploadSize: user.maxFileSize,
          usedStorage: rootFolderSize,
          totalStorage: user.maxStorageLimite,
          devicesConnected: activeSession.total,
          maxDeviceLimit: user.maxDeviceLimit,
          fileRestoreTime: user.restoreFileDays,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const subscriptionPaused = async (req, res, next) => {
  try {
    const user = req.user;
    const subscription = await Subscription.findOne({
      userId: user._id,
      subscriptions_id: user.subscriptionsId,
      status: "active",
    });
    if (!subscription) {
      return errorResponse(
        res,
        StatusCodes.NOT_FOUND,
        "active subscription not found",
      );
    }
    const pausedSub = await razorpay.subscriptions.pause(
      subscription.subscriptions_id,
    );
    if (!pausedSub) {
      return errorResponse(
        res,
        StatusCodes.BAD_REQUEST,
        "subscription is not paused try again",
      );
    }
    successResponse(res, StatusCodes.OK, "subscription successfully paused");
  } catch (error) {
    next(error);
  }
};

export const subscriptionResumed = async (req, res, next) => {
  try {
    const user = req.user;
    const subscription = await Subscription.findOne({
      userId: user._id,
      subscriptions_id: user.subscriptionsId,
      status: "paused",
    });
    if (!subscription) {
      return errorResponse(
        res,
        StatusCodes.NOT_FOUND,
        "Paused subscription is not found",
      );
    }

  
    if (
      !subscription.pausedAt ||
      new Date(subscription.pausedAt) > new Date()
    ) {
      return errorResponse(
        res,
        StatusCodes.BAD_REQUEST,
        "Invalid subscription state — pausedAt is corrupted",
      );
    }

    const resumeSubscription = await razorpay.subscriptions.resume(
      subscription.subscriptions_id,
    );
    if (!resumeSubscription) {
      return errorResponse(
        res,
        StatusCodes.BAD_GATEWAY,
        "Subscription is not resumed try again",
      );
    }
    successResponse(res, StatusCodes.OK, "Subscription successfully resumed");
  } catch (error) {
    next(error);
  }
};

