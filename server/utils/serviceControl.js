import Users from "../models/userModel.js";
import { getPlanById } from "./getPlanDetails.js";
import redisClient from "../db/redisDB.js";

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
      // Invalidate excess active sessions if more than allowed by free plan
      const activeSessions = await redisClient.ft.search(
        "userIdx",
        `@userId:{${userId}}`,
      );
      if (activeSessions.documents && activeSessions.documents.length > freePlan.maxDevices) {
        const excessSessions = activeSessions.documents.slice(freePlan.maxDevices);
        for (const doc of excessSessions) {
          await redisClient.del(doc.id);
        }
      }
    } catch (err) {
      console.warn("Failed to clean up excess sessions:", err.message);
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

