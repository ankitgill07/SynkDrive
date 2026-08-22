import crypto from "crypto";
import redisClient from "../db/redisDB.js";

export const setUserCookie = async (res, userId, parser) => {
  try {
    const sessionId = crypto.randomUUID();
    const redisKey = `session:${sessionId}`;
    const ua = parser?.getResult?.() || {};
    const browser = ua.browser?.name || "Unknown Browser";
    const os = ua.os?.name || "Unknown OS";
    const deviceName = `${browser} on ${os}`;
    await redisClient.json.set(redisKey, "$", {
      userId,
      deviceName,
      browser,
      os,
      lastActive: Date.now(),
    });
    await redisClient.expire(redisKey, 60 * 60 * 24 * 7);
    const isProduction = process.env.NODE_ENV === "production";

    res.cookie("sid", sessionId, {
      httpOnly: true,
      signed: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
      sameSite: isProduction ? "none" : "lax",
      secure: isProduction,
    });
  } catch (error) {
    throw new Error(error);
  }
};
