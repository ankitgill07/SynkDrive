import cron from "node-cron";
import Subscription from "../models/subscriptionModal.js";
import { disableUserService } from "../utils/serviceControl.js";

export const disableServiceSubscriptionPausedCron = () => {
  try {
    cron.schedule("0 * * * *", async () => {
      const now = new Date();
      const expiredSubscription = await Subscription.findOne({
        status: "paused",
        currentEnd: { $lte: now },
      });

      for (const subscription of expiredSubscription) {
        try {
          await disableUserService(subscription?.userId);
        } catch (error) {
          console.error(
            `Failed processing subscription ${subscription.subscriptions_id}`,
            err.message,
          );
        }
      }
    });
  } catch (error) {
    console.error("Subscription cron failed:", error.message);
  }
};
