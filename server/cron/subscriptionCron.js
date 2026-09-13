import Subscription from "../models/subscriptionModal.js";
import { disableUserService } from "../utils/serviceControl.js";


export const processExpiredSubscriptions = async () => {
  const now = new Date();
  const expiredSubscriptions = await Subscription.find({
    status: "paused",
    currentEnd: { $lte: now },
  });

  for (const subscription of expiredSubscriptions) {
    try {
      await disableUserService(subscription?.userId);
    } catch (error) {
      console.error(
        `Failed processing subscription ${subscription.subscriptions_id}`,
        error.message,
      );
    }
  }
};

export const disableServiceSubscriptionPausedCron = async () => {
  try {
    const cronModule = await import("node-cron");
    const cron = cronModule.default || cronModule;
    cron.schedule("0 * * * *", processExpiredSubscriptions);
  } catch (error) {
    console.error("Subscription cron failed:", error.message);
  }
};


