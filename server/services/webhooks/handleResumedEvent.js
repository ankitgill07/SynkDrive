import Subscription from "../../models/subscriptionModal.js";
import Users from "../../models/userModel.js";
import { getPlanById } from "../../utils/getPlanDetails.js";
import { enableUserService } from "../../utils/serviceControl.js";
import { sendEventToUser } from "../../controllers/eventController.js";

export const handleResumedEvent = async (webhookData) => {
  try {
    if (!webhookData?.payload?.subscription?.entity) {
      throw new Error("Invalid webhook payload");
    }

    const {
      id,
      status,
      current_end,
      notes,
    } = webhookData.payload.subscription.entity;

    if (!id || !status || !notes?.userId) {
      throw new Error("Missing required fields");
    }

    if (status !== "active") {
      throw new Error(`Expected 'active' after resume, got '${status}'`);
    }

    const { userId } = notes;
    const now = new Date();

    const subscription = await Subscription.findOne({
      subscriptions_id: id,
      userId,
    });

    if (!subscription) {
      throw new Error(`Subscription not found: ${id}`);
    }

    const currentEnd = current_end
      ? new Date(current_end * 1000)
      : subscription.currentEnd || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    const plan = getPlanById(subscription.planId);
    if (!plan) {
      throw new Error(`Plan not found: ${subscription.planId}`);
    }

    await enableUserService(userId, subscription.planId, "Webhook subscription resumed");

    subscription.status = "active";
    subscription.resumeAt = now;
    subscription.pausedAt = null;
    subscription.currentEnd = currentEnd;
    await subscription.save();

    try {
      sendEventToUser(userId, {
        type: "subscriptionResumed",
        subscriptionId: id,
      });
    } catch (sseErr) {
      console.warn("SSE notice:", sseErr.message);
    }

    return {
      success: true,
      subscriptionId: id,
      resumedAt: now,
      planName: plan.name,
      accessUntil: currentEnd,
    };
  } catch (error) {
    console.error("handleResumedEvent error:", error.message);
    throw error;
  }
};
