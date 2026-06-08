import Subscription from "../../models/subscriptionModal.js";
import Users from "../../models/userModel.js";
import { getPlanById } from "../../utils/getPlanDetails.js";
import { disableUserService } from "../../utils/serviceControl.js";


export const handlePausedEvent = async (webhookData) => {
  try {
    const { id, status, notes, current_start, current_end } =
      webhookData.payload.subscription.entity;

    if (!id || !status || !notes?.userId) {
      throw new Error("Missing required fields in webhook payload");
    }

    if (status !== "paused") {
      throw new Error(`Expected status 'paused', got '${status}'`);
    }

    const { userId } = notes;

    const subscription = await Subscription.findOne({
      subscriptions_id: id,
      userId,
    });

    if (!subscription) {
      throw new Error(`Subscription not found: ${id}`);
    }

    if (subscription.status !== "active") {
      throw new Error(
        `Cannot paused subscription with status '${subscription.status}'`,
      );
    }

    subscription.status = status;
    subscription.pausedAt = new Date();
    await subscription.save();
    disableUserService(userId);

    return;
  } catch (error) {
    console.error("handlePausedEvent error:", error.message);
    throw error;
  }
};
