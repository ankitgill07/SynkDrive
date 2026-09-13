import {
  disableServiceSubscriptionPausedCron,
  processExpiredSubscriptions,
} from "./subscriptionCron.js";
import {
  cleanExpiredRecycleBinItemsCron,
  processExpiredRecycleBinItems,
} from "./recycleBinCron.js";

export const runCronTasks = async () => {
  await Promise.allSettled([
    processExpiredSubscriptions(),
    processExpiredRecycleBinItems(),
  ]);
};

export const startCronJob = () => {
  try {
    disableServiceSubscriptionPausedCron();
    cleanExpiredRecycleBinItemsCron();
  } catch (error) {
    console.error(`cron job failed ${error}`);
  }
};

