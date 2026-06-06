import Users from "../models/userModel.js";
import { getPlanById } from "./getPlanDetails.js";
import redisClient from "../db/redisDB.js";
import File from "../models/fileModel.js";
import Subscription from "../models/subscriptionModal.js";
import { filesDeletParmanetly } from "../services/recycleBin/index.js";

export const disableUserService = async (
  userId,
  reason = "Subscription paused",
) => {
  try {
    const user = await Users.findById(userId);
    if (!user) {
      throw new Error(`User not found: ${userId}`);
    }

    const freePlan = getPlanById("free");
    if (!freePlan) {
      throw new Error("Free plan configuration not found");
    }

    user.maxStorageLimite = freePlan.storageBytes;
    user.maxDeviceLimit = freePlan.maxDevices;
    user.maxFileSize = freePlan.maxFileSizeBytes;
    user.restoreFileDays = freePlan.restoreFileDays;

    await user.save();

    try {
      const activeSessions = await redisClient.ft.search(
        "userIdx",
        `@userId:{${userId}}`,
      );
      if (activeSessions.documents) {
        for (const doc of activeSessions.documents) {
          await redisClient.del(doc.id);
        }
      }
      const subscription = await Subscription.findOne({ userId: user._id });
      const SubscriptionptimeUploadFile = await File.find({
        userId,
        createdAt: { $gte: new Date(subscription.startAt) },
      });
      for (const file of SubscriptionptimeUploadFile) {
        await filesDeletParmanetly(file._id, userId);
      }
    } catch (err) {
      console.warn("Failed to invalidate sessions:", err.message);
    }

    console.log(
      `[Service Control] Disabled service for user ${userId}: ${reason}`,
    );

    return {
      success: true,
      userId,
      reason,
      downgradedTo: "free",
      timestamp: new Date(),
    };
  } catch (error) {
    console.error(
      "[Service Control] Failed to disable service:",
      error.message,
    );
    throw error;
  }
};

export const enableUserService = async (
  userId,
  planId,
  reason = "Service restored",
) => {
  try {
    const user = await Users.findById(userId);
    if (!user) {
      throw new Error(`User not found: ${userId}`);
    }

    const plan = getPlanById(planId);
    if (!plan) {
      throw new Error(`Plan not found: ${planId}`);
    }

    user.maxStorageLimite = plan.storageBytes;
    user.maxDeviceLimit = plan.maxDevices;
    user.maxFileSize = plan.maxFileSizeBytes;
    user.restoreFileDays = plan.restoreFileDays;

    await user.save();

    console.log(
      `[Service Control] Enabled service for user ${userId}: ${reason}`,
    );

    return {
      success: true,
      userId,
      planId,
      planName: plan.name,
      reason,
      timestamp: new Date(),
    };
  } catch (error) {
    console.error("[Service Control] Failed to enable service:", error.message);
    throw error;
  }
};
