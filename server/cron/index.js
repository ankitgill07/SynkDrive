import { disableServiceSubscriptionPausedCron } from "./subscriptionCron.js";

export const startCronJob = () => {
  console.log(`
        starting schedule cron job
        `);

  disableServiceSubscriptionPausedCron();
};
