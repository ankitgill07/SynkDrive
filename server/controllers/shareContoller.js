import { StatusCodes } from "http-status-codes";
import linkShare from "../models/linkShareModel.js";
import { errorResponse, successResponse } from "../utils/apiResponse.js";
import File from "../models/fileModel.js";
import crypto, { verify } from "crypto";
import { s3GetPreSignedUrl } from "../services/file/s3Servies.js";
import { cloudfrontSignedUrl } from "../services/file/cloudFront.js";
import { shareEamilValidate } from "../validate/authValidate.js";
import { sendInviteEmail } from "../services/sendInviteEmail.js";
import emailShare from "../models/emailShareModal.js";
import Users from "../models/userModel.js";
import mongoose from "mongoose";
import path from "path";

export const shareWithPublicLink = async (req, res, next) => {
  try {
    const user = req.user;
    const { fileId } = req.params;
    const { linkEnabled } = req.body;
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
      sharedBy: new mongoose.Types.ObjectId(user._id),
      token,
      isEnabled: linkEnabled,
      permissions: "viewer",
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
    const shareLink = await linkShare
      .findOne({ fileId, token, isRevoked: false })
      .populate("sharedBy", "name email");

    if (!shareLink) {
      return errorResponse(res, StatusCodes.NOT_FOUND, "Share link not found");
    }

    const file = await File.findById(fileId);
    if (!file || file.isDeleted) {
      return errorResponse(res, StatusCodes.NOT_FOUND, "File not found");
    }

    if (!shareLink.isEnabled) {
      return successResponse(res, StatusCodes.OK, {
        isAccessible: false,
        name: file.name,
        sharedBy: shareLink.sharedBy?.name || "Unknown",
        sharedByEmail: shareLink.sharedBy?.email,
        permission: shareLink.permissions,
        extension: file.extension,
        size: file.size,
        createdAt: file.createdAt,
      });
    }

    const filePath = `${file._id}${file.extension}`;
    const fileUrl = await cloudfrontSignedUrl({
      key: filePath,
      fileName: file.name,
    });
    successResponse(res, StatusCodes.OK, {
      isAccessible: shareLink.isEnabled,
      name: file.name,
      sharedBy: shareLink.sharedBy?.name || "Unknown",
      sharedByEmail: shareLink.sharedBy?.email,
      permission: shareLink.permissions,
      extension: file.extension,
      size: file.size,
      createdAt: file.createdAt,
      url: fileUrl,
    });
  } catch (error) {
    next(error);
  }
};

export const getShareFileInfo = async (req, res) => { };

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
    const { emails, permission, message } = req.body;

    const file = await File.findOne({ _id: fileId, userId: user._id });

    if (!file) {
      return errorResponse(res, StatusCodes.FORBIDDEN, "Forbidden");
    }

    for (const email of emails) {
      const userData = await Users.findOne({ email });

      if (!userData) continue;

      const token = crypto.randomBytes(32).toString("hex");
      const hash = crypto.createHash("sha256").update(token).digest("hex");
      const url = `${process.env.FRONTEND_URL}/email/shared/${file._id}?token=${token}`;

      let existing = await emailShare.findOne({
        fileId,
        sharedBy: user._id,
      });

      if (existing) {
        const sharedUser = existing.sharedWith.find(
          item => item.userId.toString() === userData._id.toString()
        );

        if (sharedUser) {
          // Update existing user
          sharedUser.permission = permission;
          sharedUser.accessTokenHash = hash;
          existing.message = message;
        } else {
          // Add new user
          existing.sharedWith.push({
            userId: userData._id,
            permission,
            accessTokenHash: hash,
          });
          existing.message = message;
        }

        await existing.save();
      } else {
        existing = await emailShare.create({
          fileId,
          sharedBy: user._id,
          message,
          sharedWith: [
            {
              userId: userData._id,
              permission,
              accessTokenHash: hash,
            },
          ],
        });
      }

      // Always send email, whether existing or new
      await sendInviteEmail(email, file, permission, user, url);
    }

    return successResponse(res, StatusCodes.OK, "Shared successfully");
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
    const shareUser = await Users.findById(shareFile.sharedBy).select("name email");
    const tokenQuery = req.query.token ? `?token=${req.query.token}` : "";

    return successResponse(res, StatusCodes.OK, {
      isAccessible: !shareFile.isRevoked,
      name: file.name,
      sharedBy: shareUser.name,
      sharedByEmail: shareUser.email,
      permission: req.sharedUser.permission,
      extension: file.extension,
      size: file.size,
      createdAt: file.createdAt,
      url: `${process.env.BACKEND_URL}/share/files/${file._id}/stream${tokenQuery}`,
    });
  } catch (error) {
    next(error);
  }
};

export const getListPeopleAccessFile = async (req, res, next) => {
  try {
    const { fileId } = req.params;
    const emailShareFile = await emailShare.findOne({ fileId });
    if (!emailShareFile) {
      return errorResponse(res, StatusCodes.FORBIDDEN, "File not Found");
    }
    const peopleList = [];
    for (const people of emailShareFile.sharedWith) {
      const userData = await Users.findOne(people.userId);
      if (!userData) continue;

      let pictureUrl = userData.picture;
      if (pictureUrl && pictureUrl.startsWith("profile-pics/")) {
        try {
          pictureUrl = await cloudfrontSignedUrl({
            key: pictureUrl,
            fileName: `profile${path.extname(pictureUrl)}`,
          });
        } catch (err) {
          console.error("Failed to sign profile picture URL:", err);
        }
      }

      peopleList.push({
        name: userData.name,
        picture: pictureUrl,
        email: userData.email,
        permission: people.permission,
      });
    }
    return successResponse(res, StatusCodes.OK, peopleList);
  } catch (error) {
    next(error)
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
  } catch (error) { }
};

export const getSharedFileDashboard = async (req, res, next) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return errorResponse(
        res,
        StatusCodes.UNAUTHORIZED,
        "User not authenticated"
      );
    }

    const [teamShares, publicShares, sharedWithMe] = await Promise.all([
      emailShare
        .find({
          sharedBy: userId,
          isRevoked: false,
        })
        .populate("sharedWith.userId", "name email")
        .lean(),

      linkShare
        .find({
          sharedBy: userId,
          isRevoked: false,
        })
        .lean(),

      emailShare
        .find({
          "sharedWith.userId": userId,
          isRevoked: false,
        })
        .populate("sharedBy", "name email")
        .populate("sharedWith.userId", "name email")
        .lean(),
    ]);

    // Collect all fileIds
    const fileIds = [
      ...teamShares.map((x) => x.fileId),
      ...publicShares.map((x) => x.fileId),
      ...sharedWithMe.map((x) => x.fileId),
    ];

    // Fetch all files once
    const files = await File.find({
      _id: { $in: fileIds },
    })
      .select("name extension size createdAt")
      .lean();

    const fileMap = new Map(
      files.map((file) => [file._id.toString(), file])
    );


    // Shared by me
    const sharedByMeData = [
      ...teamShares.map((share) => ({
        type: "team",
        fileName: fileMap.get(share.fileId.toString())?.name,
        sharedWith: share.sharedWith.map((user) => ({
          name: user.userId?.name,
          email: user.userId?.email,
          permission: user.permission,
        })),
        createdAt: share.createdAt,
      })),

      ...publicShares.map((share) => ({
        type: "public",
        fileName: fileMap.get(share.fileId.toString())?.name,
        permission: share.permissions,
        createdAt: share.createdAt,
        expiresAt: share.expiresAt,
      })),
    ];

    // Shared with me
    const sharedWithMeData = sharedWithMe.map((share) => {
      const me = share.sharedWith.find(
        (u) => u.userId?._id.toString() === userId.toString()
      );
      const file = fileMap.get(share.fileId.toString());

      return {
        fileName: file?.name,
        fileId : share.fileId,
        extension: file?.extension,
        size: file?.size,
        permission: me?.permission,
        sharedBy: {
          name: share.sharedBy?.name,
          email: share.sharedBy?.email,
        },
        createdAt: share.createdAt,
      };
    });

    return successResponse(
      res,
      StatusCodes.OK,
      {
        sharedByMe: sharedByMeData,
        sharedWithMe: sharedWithMeData,
        count: {
          totalSharedByMeFiles: sharedByMeData.length,
          totalSharedWithFiles: sharedWithMeData.length
        }

      }
    );

  } catch (error) {
    next(error);
  }
};


export const getUsertoShareFilewithEmail = async (req, res, next) => {
  try {
    const { email } = req.params;


    const users = await Users.find({ email }).select("_id name email picture").limit(5).lean();
    if (!users || users.length === 0) {
      return errorResponse(res, StatusCodes.NOT_FOUND, "User not found");
    }

    for (const u of users) {
      if (u.picture && u.picture.startsWith("profile-pics/")) {
        try {
          u.picture = await cloudfrontSignedUrl({
            key: u.picture,
            fileName: `profile${path.extname(u.picture)}`,
          });
        } catch (err) {
          console.error("Failed to sign user search picture:", err);
        }
      }
    }

    res.json({ data: users });
  } catch (error) {
    next(error);
  }
};
