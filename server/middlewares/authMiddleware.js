import { StatusCodes } from "http-status-codes";
import redisClient from "../db/redisDB.js";
import Users from "../models/userModel.js";
import { errorResponse } from "../utils/apiResponse.js";

export async function checkAuth(req, res, next) {
  const { sid } = req.signedCookies;
  try {
    if (!sid) {
      return res.status(401).json({ error: "User not found" });
    }
    const session = await redisClient.json.get(`session:${sid}`);
    await redisClient.json.set(`session:${sid}`, "$.lastActive", Date.now());
    if (!session) {
      return res.status(401).json({ error: "User not found" });
    }
    const user = await Users.findById(session.userId);

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    } else if (user.isDisable) {
      return errorResponse(
        res,
        StatusCodes.FORBIDDEN,
        "Your account is deactivated. Please contact support for reactivation.",
      );
    }
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
}
