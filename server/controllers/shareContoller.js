import { StatusCodes } from "http-status-codes";
import linkShare from "../models/linkShareModel.js";
import { errorResponse, successResponse } from "../utils/apiResponse.js";
import File from "../models/fileModel.js";
import crypto, { verify } from "crypto";
import { s3GetPreSignedUrl } from "../services/file/s3Servies.js";
import { ObjectId } from "mongodb";
import { cloudfrontSignedUrl } from "../services/file/cloudFront.js";
import { shareEamilValidate } from "../validate/authValidate.js";
import { sendInviteEmail } from "../services/sendInviteEmail.js";
import emailShare from "../models/emailShareModal.js";
import Users from "../models/userModel.js";
import mongoose from "mongoose";

export const shareWithPublicLink = async (req, res, next) => {
  try {
    const user = req.user;
    const { fileId } = req.params;
    const { linkEnabled, linkPermission } = req.body;
    const file = await File.findOne({ _id: fileId, userId: user._id });
    if (!file) {
      return errorResponse(res, StatusCodes.FORBIDDEN, "Forbidden");
    }
    const existing = await linkShare.findOne({
      fileId: fileId,
      sharedBy: user._id,
    });

    if (existing) {
      const link = `${process.env.FRONTEND_URL}/public/shared/${file._id}?token=${existing.token}`;
      return successResponse(res, StatusCodes.OK, {
        shareUrl: link,
        linkEnabled: existing.isEnabled,
        linkPermission: existing.permissions,
      });
    }
    const token = crypto.randomBytes(32).toString("hex");
    const newShare = await linkShare.create({
      fileId,
      sharedBy: new ObjectId(user._id),
      token,
      isEnabled: linkEnabled,
      permissions: linkPermission,
    });

    return successResponse(res, StatusCodes.CREATED, {
      shareUrl: `${process.env.FRONTEND_URL}/public/shared/${file._id}?token=${token}`,
      linkEnabled: newShare.isEnabled,
      linkPermission: newShare.permissions,
    });
  } catch (error) {
    next(error);
  }
};

export const getShareWithLink = async (req, res, next) => {
  try {
    const { fileId } = req.params;
    const { token } = req.query;
    const { name } = req.user;
    const shareLink = await linkShare.findOne({ fileId, token });
    // if (!shareLink.isLinkValid()) {
    //   return errorResponse(
    //     res,
    //     StatusCodes.FORBIDDEN,
    //     "Link expired or revoked",
    //   );
    // }
    const file = await File.findById(fileId);
    const filePath = `${file._id}${file.extension}`;
    const fileUrl = await cloudfrontSignedUrl({
      key: filePath,
      fileName: file.name,
    });
    successResponse(res, StatusCodes.OK, {
      isAccessible: shareLink.isEnabled,
      name: file.name,
      sharedBy: name,
      permission: shareLink.permissions,
      url: fileUrl,
    });
  } catch (error) {
    next(error);
  }
};

export const getShareFileInfo = async (req, res) => {};

export const shareFileToggle = async (req, res, next) => {
  try {
    const { fileId } = req.params;
    const userId = req.user._id;
    const { linkEnabled } = req.body;
    const shareFile = await linkShare.findOneAndUpdate(
      { fileId, sharedBy: userId },
      { $set: { isEnabled: linkEnabled } },
      { new: true },
    );
    if (!shareFile) {
      return errorResponse(res, StatusCodes.FORBIDDEN, "Not Found Share File");
    }
    successResponse(res, StatusCodes.OK, {
      linkEnabled: shareFile.isEnabled,
      linkPermission: shareFile.permissions,
    });
  } catch (error) {
    next(error);
  }
};

export const shareWithLinkPermissionChange = async (req, res, next) => {
  try {
    const { fileId } = req.params;
    const { linkPermission } = req.body;
    const shareFile = await linkShare.findOneAndUpdate(
      { fileId },
      { $set: { permissions: linkPermission } },
      { new: true },
    );
    if (!shareFile) {
      return errorResponse(res, StatusCodes.FORBIDDEN, "Not Found Share File");
    }
    successResponse(res, StatusCodes.OK, {
      linkEnabled: shareFile.isEnabled,
      linkPermission: shareFile.permissions,
    });
  } catch (error) {
    next(error);
  }
};

export const shareInviteWithEmail = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { fileId } = req.params;
    const user = req.user;
    const { email, permission } = req.body;

    const file = await File.findOne({ _id: fileId, userId: user._id });

    if (!file) {
      return errorResponse(res, StatusCodes.FORBIDDEN, "Forbidden");
    }

    const existing = await emailShare.findOne({
      fileId,
      sharedBy: user._id,
      email: email,
    });
    const token = crypto.randomBytes(32).toString("hex");
    const hash = crypto.createHash("sha256").update(token).digest("hex");
    const url = `${process.env.FRONTEND_URL}/email/shared/${file._id}?token=${token}`;

    if (existing) {
      existing.accessTokenHash = hash;
      existing.permission = permission;
      await existing.save();
      await sendInviteEmail(email, file, permission, user, url);
      return successResponse(res, StatusCodes.OK, "Invite resent");
    }

    const sendInvite = await emailShare.create({
      fileId,
      sharedBy: user._id,
      email,
      permission,
      accessTokenHash: hash,
    });

    await sendInviteEmail(email, file, permission, user, url);
    successResponse(res, StatusCodes.CREATED, "shared successfully");
    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};

export const getShareFileWithEmailData = async (req, res, next) => {
  try {
    const { file, shareFile } = req;
    const shareUser = await Users.findById(shareFile.sharedBy);
    return successResponse(res, StatusCodes.OK, {
      isAccessible: !shareFile.isRevoked,
      name: file.name,
      sharedBy: shareUser.name,
      permission: shareFile.permissions,
      url: `${process.env.BACKEND_URL}/share/files/${file._id}/stream?token=${req.query.token}`,
    });
  } catch (error) {
    next();
  }
};

export const streamSharedFile = async (req, res, next) => {
  try {
    const { file } = req;
    const fileUrl = await cloudfrontSignedUrl({
      key: `${file._id}${file.extension}`,
      fileName: file.name,
    });
    return res.redirect(fileUrl);
  } catch (error) {
    next(error);
  }
};

export const shareWithEmailPermissionChange = async (req, res, next) => {
  try {
    const { fileId } = req.params;
    const { emailPermission } = req.body;
    const shareFile = await emailShare.findOneAndUpdate(
      { fileId },
      { $set: { permission: emailPermission } },
      { new: true },
    );
    if (!shareFile) {
      return errorResponse(res, StatusCodes.FORBIDDEN, "Not Found Share File");
    }
    successResponse(res, StatusCodes.OK, {
      isAccessible: shareFile.isRevoked,
      permission: shareFile.permission,
    });
  } catch (error) {}
};
