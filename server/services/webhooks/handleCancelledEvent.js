import Subscription from "../../models/subscriptionModal.js";
import Users from "../../models/userModel.js";
import { getPlanById } from "../../utils/getPlanDetails.js";
import File from "../../models/fileModel.js";

export const handleCancelledEvent = async (webhookData) => {
  try {
    const {
      id,
      plan_id,
      status,
      notes: { userId },
    } = webhookData.payload.subscription.entity;

    const user = await Users.findById(userId).populate("subscription");
    if (!user) {
      throw new Error("User not found");
    }

    const subscription = await Subscription.findOne({
      subscriptions_id: id,
      userId: user._id,
    });
    if (!subscription) {
      throw new Error("Subscription not found");
    }

    if (subscription.status === "created") {
      throw new Error("User selected a different plan");
    }

    if (subscription.status === "cancelled" || status === "cancelled") {
      const freeplan = getPlanById("free");

      user.maxStorageLimit = freeplan.storageBytes;
      user.subscriptionsId = id;
      user.maxDeviceLimit = freeplan.maxDevices;
      user.maxFileSize = freeplan.maxFileSizeBytes;
      user.restoreFileDays = freeplan.restoreFileDays;
      await user.save();

      const filesUploadedDuringSubscription = await File.find({
        userId: user._id,
        createdAt: { $gte: new Date(subscription.startAt) },
      });

      for (const file of filesUploadedDuringSubscription) {
        await filesDeletParmanetly(file._id, user._id);
      }
    }

    subscription.status = status;
    subscription.cancelledAt = Date.now();
    await subscription.save();
  } catch (error) {
    throw error;
  }
};
