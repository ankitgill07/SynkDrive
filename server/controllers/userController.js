import { StatusCodes } from "http-status-codes";
import redisClient from "../db/redisDB.js";
import Users from "../models/userModel.js";
import { errorResponse, successResponse } from "../utils/apiResponse.js";
import Folder from "../models/folderModel.js";
import File from "../models/fileModel.js";
import { s3DeleteObjects, s3UploadFile, s3DeletePreSingedUrl } from "../services/file/s3Servies.js";
import { cloudfrontSignedUrl } from "../services/file/cloudFront.js";
import path from "path";
import fs from "fs";
import Subscription from "../models/subscriptionModal.js";

export const updateProfile = async (req, res, next) => {
  const name = req.body.name;
  const userId = req.user._id;
  try {
    const user = await Users.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    let profileImage = user.picture;

    if (req.file) {
      const ext = path.extname(req.file.originalname);
      const s3Key = `profile-pics/${userId}-${Date.now()}${ext}`;

      // Upload to S3
      await s3UploadFile({
        filePath: req.file.path,
        key: s3Key,
        contentType: req.file.mimetype,
      });

      // Delete local temp file
      try {
        await fs.promises.unlink(req.file.path);
      } catch (err) {
        console.error("Failed to delete local temp file:", err);
      }

      // Delete old profile image from S3 if it exists
      if (user.picture && user.picture.startsWith("profile-pics/")) {
        try {
          await s3DeletePreSingedUrl({ key: user.picture });
        } catch (err) {
          console.error("Failed to delete old profile image from S3:", err);
        }
      }

      profileImage = s3Key;
    }

    user.name = name || user.name;
    user.picture = profileImage;
    await user.save();

    res.status(201).json({ success: "Update the profile" });
  } catch (error) {
    console.error("Update profile error:", error);
    next(error);
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

    let pictureUrl = user.picture;
    if (pictureUrl && pictureUrl.startsWith("profile-pics/")) {
      try {
        pictureUrl = await cloudfrontSignedUrl({
          key: pictureUrl,
          fileName: `profile${path.extname(pictureUrl)}`,
        });
      } catch (err) {
        console.error("Failed to sign CloudFront URL for profile picture:", err);
      }
    }

    res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
      picture: pictureUrl,
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

    await redisClient.del(`session:${sid}`);

    const isProduction = process.env.NODE_ENV === "production";
    res.clearCookie("sid", {
      httpOnly: true,
      signed: true,
      sameSite: isProduction ? "none" : "lax",
      secure: isProduction,
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

    await redisClient.del(`session:${sid}`);
    
    const isProduction = process.env.NODE_ENV === "production";
    res.clearCookie("sid", {
      httpOnly: true,
      signed: true,
      sameSite: isProduction ? "none" : "lax",
      secure: isProduction,
    });
    return res.status(200).json({ success: "Account disabled successfully" });
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
    await redisClient.del(sid);
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
    const isProduction = process.env.NODE_ENV === "production";
    res.clearCookie("sid", {
      httpOnly: true,
      signed: true,
      sameSite: isProduction ? "none" : "lax",
      secure: isProduction,
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
      return errorResponse(res, StatusCodes.NOT_FOUND, "user not found");
    }
    const user = await Users.findById(userId);
    const files = await File.find({ userId: userId });
    await Folder.deleteMany({ userId: userId });
    const Keys = files.map(({ _id, extension }) => ({
      Key: `${_id}${extension}`,
    }));
    if (user && user.picture && user.picture.startsWith("profile-pics/")) {
      Keys.push({ Key: user.picture });
    }
    if (Keys.length > 0) {
      await s3DeleteObjects({ Keys });
    }
    await File.deleteMany({ _id: { $in: files.map(({ _id }) => _id) } });
    await Subscription.deleteMany({ userId: userId });
    const sessions = await redisClient.ft.search(
      "userIdx",
      `@userId:{${userId}}`,
    );
    for (const { id } of sessions.documents) {
      await redisClient.del(id);
    }
    await Users.findByIdAndDelete(userId);
    const isProduction = process.env.NODE_ENV === "production";
    res.clearCookie("sid", {
      httpOnly: true,
      signed: true,
      sameSite: isProduction ? "none" : "lax",
      secure: isProduction,
    });
    return res.status(200).json({ success: "Account deleted successfully" });
  } catch (error) {
    next(error);
  }
};
