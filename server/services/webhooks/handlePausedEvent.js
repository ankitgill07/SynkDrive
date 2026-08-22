import Subscription from "../../models/subscriptionModal.js";
import Users from "../../models/userModel.js";
import { getPlanById } from "../../utils/getPlanDetails.js";
import { disableUserService } from "../../utils/serviceControl.js";
import { sendEventToUser } from "../../controllers/eventController.js";

export const handlePausedEvent = async (webhookData) => {
  try {
    const { id, status, notes } =
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

    subscription.status = status;
    subscription.pausedAt = new Date();
    await subscription.save();
    await disableUserService(userId);

    try {
      sendEventToUser(userId, {
        type: "subscriptionPaused",
        subscriptionId: id,
      });
    } catch (sseErr) {
      console.warn("SSE notice:", sseErr.message);
    }

    return { success: true };
  } catch (error) {
    console.error("handlePausedEvent error:", error.message);
    throw error;
  }
};
