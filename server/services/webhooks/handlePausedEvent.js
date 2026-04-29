import Subscription from "../../models/subscriptionModal.js";

export const handlePausedEvent = async (webhookData) => {
  try {
    const {
      id,
      plan_id,
      status,
      notes: { userId },
    } = webhookData.payload.subscription.entity;
    const subscription = await Subscription.findOne({
      subscriptions_id: id,
      userId,
    });
    if (!subscription) {
      return "Subscription not found:";
    }
    subscription.status = status;
    subscription.pausedAt = new Date();
    await subscription.save();
  } catch (error) {
    throw error;
  }
};
