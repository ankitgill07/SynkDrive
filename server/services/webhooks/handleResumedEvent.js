import Subscription from "../../models/subscriptionModal.js";
import Users from "../../models/userModel.js";
import { getPlanById } from "../../utils/getPlanDetails.js";

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

    // Retrieve subscription and user
    const subscription = await Subscription.findOne({
      subscriptions_id: id,
      userId,
    });

    if (!subscription) {
      throw new Error(`Subscription not found: ${id}`);
    }

    // Can only resume from paused status
    if (subscription.status !== "paused") {
      throw new Error(
        `Cannot resume from status '${subscription.status}' (expected 'paused')`,
      );
    }

    // Validate pausedAt exists and is in the past
    if (!subscription.pausedAt || subscription.pausedAt > now) {
      throw new Error("Invalid pausedAt date — subscription state corrupted");
    }

    const currentEnd = current_end
      ? new Date(current_end * 1000)
      : subscription.currentEnd;

    if (!currentEnd || isNaN(currentEnd.getTime())) {
      throw new Error("Invalid or missing currentEnd date");
    }

    // Can't resume if billing cycle already ended
    if (now >= currentEnd) {
      throw new Error(`Cannot resume — billing period ended on ${currentEnd.toDateString()}`);
    }

    const plan = getPlanById(subscription.planId);
    if (!plan) {
      throw new Error(`Plan not found: ${subscription.planId}`);
    }

    const user = await Users.findById(userId);
    if (!user) {
      throw new Error(`User not found: ${userId}`);
    }


    user.maxStorageLimite = plan.storageBytes;
    user.maxDeviceLimit = plan.maxDevices;
    user.maxFileSize = plan.maxFileSizeBytes;
    user.restoreFileDays = plan.restoreFileDays;
    await user.save();

    // Update subscription status
    subscription.status = "active";
    subscription.resumeAt = now;
    subscription.pausedAt = null;
    subscription.currentEnd = currentEnd;
    await subscription.save();

    return {
      success: true,
      subscriptionId: id,
      resumedAt: now,
      planName: plan.name,
      accessUntil: currentEnd,
      remainingDays: Math.ceil((currentEnd - now) / (1000 * 60 * 60 * 24)),
    };
  } catch (error) {
    console.error("handleResumedEvent error:", error.message);
    throw error;
  }
};
