import Subscription from "../../models/subscriptionModal.js";
import Users from "../../models/userModel.js";
import { getPlanById } from "../../utils/getPlanDetails.js";

export const handleCancelledEvent = async (webhookData) => {
  try {
    const {
      id,
      status,
      notes: { userId },
    } = webhookData.payload.subscription.entity;

    if (!id || !status || !userId) {
      throw new Error("Missing required fields in webhook payload");
    }

    if (status !== "cancelled") {
      throw new Error(`Expected status 'cancelled', got '${status}'`);
    }

    const user = await Users.findById(userId);
    if (!user) {
      throw new Error(`User not found: ${userId}`);
    }

    const subscription = await Subscription.findOne({
      subscriptions_id: id,
      userId: user._id,
    });

    if (!subscription) {
      throw new Error(`Subscription not found: ${id}`);
    }

    if (subscription.status === "cancelled") {
      return { success: true, skipped: true, reason: "already_cancelled" };
    }

    subscription.status = status;
    subscription.cancelledAt = new Date();
    await subscription.save();

    const freePlan = getPlanById("free");
    if (freePlan) {
      user.maxStorageLimite = freePlan.storageBytes;
      user.maxDeviceLimit = freePlan.maxDevices;
      user.maxFileSize = freePlan.maxFileSizeBytes;
      user.restoreFileDays = freePlan.restoreFileDays;
      user.subscriptionsId = null;
      await user.save();
    }

    return {
      success: true,
      subscriptionId: id,
      cancelledAt: subscription.cancelledAt,
      downgradedTo: "free",
    };
  } catch (error) {
    console.error("handleCancelledEvent error:", error.message);
    throw error;
  }
};
