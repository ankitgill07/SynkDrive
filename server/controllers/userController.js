import { StatusCodes } from "http-status-codes";
import redisClient from "../db/redisDB.js";
import Users from "../models/userModel.js";
import { errorResponse, successResponse } from "../utils/apiResponse.js";
import Folder from "../models/FolderModel.js";
import File from "../models/fileModel.js";
import { s3DeleteObjects } from "../services/file/s3Servies.js";

export const updateProfile = async (req, res) => {
  const name = req.body.name;
  let profileImage;
  if (req.file) {
    profileImage = `http://localhost:4000/uploads/${req.file.filename}`;
  }
  const userId = req.user._id;
  try {
    await Users.findByIdAndUpdate(
      { _id: userId },
      {
        name,
        picture: profileImage,
      },
    );
    res.status(201).json({ success: "Update the profile" });
  } catch (error) {
    res.status(403).json(error);
  }
};

export const getUserProfile = async (req, res, next) => {
  try {
    const user = req.user;
    const { sid } = req.signedCookies;
    const rootFolder = await Folder.findById(user.rootFolderId);
    const session = await redisClient.ft.search(
      "userIdx",
      `@userId:{${user._id}}`,
    );
    const allSessions = session.documents.map(({ id, value }) => {
      return {
        ...value,
        sessionId: id,
        isCurrent: id === `session:${sid}`,
      };
    });
    res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
      picture: user.picture,
      maxStorageLimite: user.maxStorageLimite,
      usedStorage: rootFolder.size,
      sessions: allSessions,
      socialLogin: user.createdWith !== "email",
      socialProvider: user.createdWith === "email" ? null : user.createdWith,
    });
  } catch (error) {
    next(error);
  }
};

export const userLogout = async (req, res) => {
  try {
    const { sid } = req.signedCookies;

    if (!sid) {
      return res.status(400).json({ error: "No session id found" });
    }

    await redisClient.json.del(`session:${sid}`);

    res.clearCookie("sid", {
      httpOnly: true,
      signed: true,
      sameSite: "lax",
    });

    return res.status(200).json({ success: "Logout successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(503).json({ error: "Service unavailable" });
  }
};

export const disableUserAccount = async (req, res, next) => {
  try {
    const { sid } = req.signedCookies;
    const user = req.user;
    if (!sid) {
      return errorResponse(res, StatusCodes.NOT_FOUND, "Session id not found");
    }
    const userData = await Users.findById(user._id);
    userData.isDisable = true;
    await userData.save();

    await redisClient.json.del(`session:${sid}`);
    res.clearCookie("sid", {
      httpOnly: true,
      signed: true,
      sameSite: "lax",
    });
    return res.end();
  } catch (error) {
    next(error);
  }
};

export const setManaulLoginPassword = async (req, res, next) => {
  try {
    const { password } = req.body;
    const userId = req.user._id;
    const userData = await Users.findById(userId);
    if (!userData) {
      return errorResponse(
        res,
        StatusCodes.UNAUTHORIZED,
        "Invalid credentials",
      );
    }
    userData.password = password;
    userData.loginWithPassword = true;
    await userData.save();
    return successResponse(res, StatusCodes.CREATED, "Password Set");
  } catch (error) {
    next(error);
  }
};

export const updateUserPassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userData = await Users.findById(req.user._id);
    if (!userData) {
      return errorResponse(
        res,
        StatusCodes.UNAUTHORIZED,
        "Invalid credentials",
      );
    }
    const verifyPassword = await userData.comparePassword(currentPassword);
    if (!verifyPassword) {
      return errorResponse(res, StatusCodes.NOT_FOUND, "Invalid Passoword");
    }
    userData.password = newPassword;
    await userData.save();
    return successResponse(res, StatusCodes.OK, "Password Updated");
  } catch (error) {
    next(error);
  }
};

export const getAllSessions = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const session = await redisClient.ft.search(
      "userIdx",
      `@userId:{${userId}}`,
    );
    const all = session.documents.map(({ value }) => value);
    console.log(all);
    res.json(all);
  } catch (error) {
    next(error);
  }
};

export const logoutDevicesBySid = async (req, res, next) => {
  try {
    const { sid } = req.params;
    if (!sid) {
      return res.status(400).json({ error: "No session id found" });
    }
    await redisClient.json.del(sid);
    successResponse(res, StatusCodes.NO_CONTENT, "Session revoked");
  } catch (error) {
    next(error);
  }
};

export const logoutForAllDevices = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const sessions = await redisClient.ft.search(
      "userIdx",
      `@userId:{${userId}}`,
    );
    for (const { id } of sessions.documents) {
      await redisClient.del(id);
    }
    res.clearCookie("sid", {
      httpOnly: true,
      signed: true,
      sameSite: "lax",
    });
    return successResponse(
      res,
      StatusCodes.NO_CONTENT,
      "logout form all device",
    );
  } catch (error) {
    next(error);
  }
};

export const deleteAccountPermanetly = async (req, res, next) => {
  try {
    const userId = req.user._id;
    if (!userId) {
      errorResponse(res, StatusCodes.NOT_FOUND, "user not found");
    }
    const files = await File.find({ userId: userId });
    await Folder.deleteMany({ userId: userId });
    const Keys = files.map(({ _id, extension }) => ({
      Key: `${_id}${extension}`,
    }));
    await s3DeleteObjects({ Keys });
    await File.deleteMany({ _id: { $in: files.map(({ _id }) => _id) } });
    const sessions = await redisClient.ft.search(
      "userIdx",
      `@userId:{${userId}}`,
    );
    for (const { id } of sessions.documents) {
      await redisClient.del(id);
    }
    await Users.findByIdAndDelete(userId);
    successResponse(res, StatusCodes.NO_CONTENT, "Account Deleted");
  } catch (error) {
    next(error);
  }
};
