import Razoray from "razorpay";
import Subscription from "../models/subscriptionModal.js";
import { errorResponse, successResponse } from "../utils/apiResponse.js";
import { StatusCodes } from "http-status-codes";
import { getPlanById } from "../utils/getPlanDetails.js";

const razorpay = new Razoray({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const createSubscription = async (req, res, next) => {
  try {
    const { planId } = req.body;
    const user = req.user;
    const vaildPlan = getPlanById(planId);
    if (!vaildPlan) {
      return errorResponse(
        res,
        StatusCodes.BAD_GATEWAY,
        "Plan Id  is not valid",
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
        await razorpay.subscriptions.cancel(oldSubscription.subscriptions_id);

        const subscription = await razorpay.subscriptions.create({
          plan_id: planId,
          total_count: 120,
          notes: { userId: user._id, userEmail: user.email },
        });

        await Subscription.findByIdAndUpdate(oldSubscription._id, {
          planId: subscription.plan_id,
          subscriptions_id: subscription.id,
        });

        return successResponse(res, StatusCodes.CREATED, {
          subscriptionId: subscription.id,
        });
      }
    }

    const newSubscription = await razorpay.subscriptions.create({
      plan_id: planId,
      total_count: 120,
      notes: { userId: user._id, userEmail: user.email },
    });

    await Subscription.create({
      subscriptions_id: newSubscription.id,
      planId: planId,
      status: newSubscription.status,
      userId: user._id,
    });

    return successResponse(res, StatusCodes.CREATED, {
      subscriptionId: newSubscription.id,
    });
  } catch (error) {
    next(error);
  }
};
