import Subscription from "../../models/subscriptionModal.js";
import Users from "../../models/userModel.js";
import { disableUserService } from "../../utils/serviceControl.js";
import { sendEventToUser } from "../../controllers/eventController.js";

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

    const subscription = await Subscription.findOne({
      subscriptions_id: id,
      userId,
    });

    if (subscription) {
      subscription.status = status;
      subscription.cancelledAt = new Date();
      await subscription.save();
    }

    await disableUserService(userId, "Webhook subscription cancelled");

    const user = await Users.findById(userId);
    if (user) {
      user.subscriptionsId = null;
      await user.save();
    }

    try {
      sendEventToUser(userId, {
        type: "subscriptionCancelled",
        subscriptionId: id,
      });
    } catch (sseErr) {
      console.warn("SSE notice:", sseErr.message);
    }

    return {
      success: true,
      subscriptionId: id,
      downgradedTo: "free",
    };
  } catch (error) {
    console.error("handleCancelledEvent error:", error.message);
    throw error;
  }
};
