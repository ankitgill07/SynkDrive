import mongoose from "mongoose";
import File from "../models/fileModel.js";
import emailShare from "../models/emailShareModal.js";
import Users from "../models/userModel.js";
import crypto from "crypto";
import { errorResponse } from "../utils/apiResponse.js";
import { StatusCodes } from "http-status-codes";

export default function (req, res, next, id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(403).json({ error: `Invild ID ${id}` });
  }
  next();
}


export  async function validateEmailShare (req , res , next) {
   try {
      const { fileId } = req.params;
      const { token } = req.query;
      
      const user = req.user;
      const file = await File.findById(fileId);
      if (!file) {
        return errorResponse(res, StatusCodes.FORBIDDEN, "File not found");
      }
      const shareFile = await emailShare.findOne({ fileId });
          if (!shareFile) {
      return errorResponse(res, StatusCodes.NOT_FOUND, "Share record not found");
    }
    if (shareFile.isRevoked) {
      return errorResponse(res, StatusCodes.FORBIDDEN, "Access has been revoked");
    }
    const sharedUser = shareFile.sharedWith.find(
      (item) => item.userId.toString() === user._id.toString()
    );

   if (!sharedUser) {
      return errorResponse(res, StatusCodes.UNAUTHORIZED, "User is not authorized");
    }

    if (token) {
      const validFileToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

      if (validFileToken !== sharedUser.accessTokenHash) {
        return errorResponse(res, StatusCodes.FORBIDDEN, "Invalid token");
      }
    }

      req.file = file
      req.shareFile = shareFile
      req.sharedUser = sharedUser
      next()
    } catch (error) {
      next(error)
    }
}
