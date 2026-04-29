import Subscription from "../../models/subscriptionModal.js";
import Users from "../../models/userModel.js";
import { getPlanById } from "../../utils/getPlanDetails.js";

export const handleActivatedEvent = async (webhookData) => {
  const {
    id,
    plan_id,
    status,
    current_start,
    current_end,
    start_at,
    end_at,
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
  subscription.currentStart = current_start * 1000;
  subscription.currentEnd = current_end * 1000;
  subscription.startAt = start_at * 1000;
  subscription.invoiceId = webhookData.payload.payment.entity.invoice_id;
  subscription.endAt = end_at * 1000;
  await subscription.save();

  const planDetails = getPlanById(plan_id);
  if (!planDetails) {
    throw new Error(`Invalid plan_id: ${plan_id}`);
  }
  const user = await Users.findById(userId);

  user.subscriptionsId = id;
  user.maxStorageLimite = planDetails.storageBytes;
  user.maxDeviceLimit = planDetails.maxDevices;
  user.maxFileSize = planDetails.maxFileSizeBytes;
  user.restoreFileDays = planDetails.restoreFileDays;
  await user.save();
};
