import Subscription from "../../models/subscriptionModal.js";
import Users from "../../models/userModel.js";
import { getPlanById } from "../../utils/getPlanDetails.js";
import { sendEventToUser } from "../../controllers/eventController.js";

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
  subscription.currentStart = current_start ? current_start * 1000 : new Date();
  subscription.currentEnd = current_end ? current_end * 1000 : null;
  subscription.startAt = start_at ? start_at * 1000 : new Date();
  subscription.invoiceId = webhookData.payload?.payment?.entity?.invoice_id || null;
  subscription.endAt = end_at ? end_at * 1000 : null;
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

  try {
    sendEventToUser(userId, {
      type: "subscriptionActivated",
      txnId: webhookData.payload?.payment?.entity?.id || id,
      subscriptionId: id,
    });
  } catch (sseErr) {
    console.warn("SSE notification failed:", sseErr.message);
  }
};
