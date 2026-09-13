import { disableServiceSubscriptionPausedCron } from "./subscriptionCron.js";
import { cleanExpiredRecycleBinItemsCron } from "./recycleBinCron.js";

export const startCronJob = () => {
  try {
    disableServiceSubscriptionPausedCron();
    cleanExpiredRecycleBinItemsCron();
  } catch (error) {
    console.error(`cron job failed ${error}`);
  }
};
