import { disableServiceSubscriptionPausedCron } from "./subscriptionCron.js";
import { cleanExpiredRecycleBinItemsCron } from "./recycleBinCron.js";

export const startCronJob = () => {
try {
    console.log(`
        starting schedule cron job
        `);

  disableServiceSubscriptionPausedCron();
  cleanExpiredRecycleBinItemsCron();
} catch (error) {
  console.log(`cron job filed ${error}`);
}
};
