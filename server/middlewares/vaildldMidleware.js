import { ObjectId } from "mongodb";
import File from "../models/fileModel.js";
import emailShare from "../models/emailShareModal.js";
import Users from "../models/userModel.js";
import crypto, { verify } from "crypto";
import { errorResponse } from "../utils/apiResponse.js";
import { StatusCodes } from "http-status-codes";

export default function (req, res, next, id) {
  if (!ObjectId.isValid(id)) {
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
      const validFileToken = crypto.createHash("sha256").update(token).digest("hex");
    if (validFileToken !== shareFile.accessTokenHash) {
      return errorResponse(res, StatusCodes.FORBIDDEN, "Invalid token");
    }
   if (user.email !== shareFile.email) {
      return errorResponse(res, StatusCodes.UNAUTHORIZED, "User is not authorized");
    }
      req.file = file
      req.shareFile = shareFile
      next()
    } catch (error) {
      next(error)
    }
}