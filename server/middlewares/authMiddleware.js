import { StatusCodes } from "http-status-codes";
import redisClient from "../db/redisDB.js";
import Users from "../models/userModel.js";
import { errorResponse } from "../utils/apiResponse.js";

export async function checkAuth(req, res, next) {
  const { sid } = req.signedCookies;
  try {
    if (!sid) {
      return errorResponse(res, StatusCodes.UNAUTHORIZED, "Unauthorized. Please log in again.");
    }

    const session = await redisClient.json.get(`session:${sid}`);

    if (!session) {
      return errorResponse(res, StatusCodes.UNAUTHORIZED, "Session expired. Please log in again.");
    }
    await redisClient.json.set(`session:${sid}`, "$.lastActive", Date.now());

    const user = await Users.findById(session.userId);

    if (!user) {
      return errorResponse(res, StatusCodes.UNAUTHORIZED, "User not found");
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

export function requireRole(allowedRoles) {
  return (req, res, next) => {
    try {
      if (!req.user || !req.user.role) {
        return errorResponse(res, StatusCodes.FORBIDDEN, "Access denied. Role not found.");
      }
      const userRole = req.user.role.toLowerCase();
      const roles = allowedRoles.map((role) => role.toLowerCase());
      if (!roles.includes(userRole)) {
        return errorResponse(res, StatusCodes.FORBIDDEN, "Access denied. Insufficient permissions.");
      }
      next();
    } catch (error) {
      next(error);
    }
  };
}
