import path from "path";
import File from "../models/fileModel.js";
import Folder from "../models/folderModel.js ";
import { ObjectId } from "mongodb";
import { getFolderSize } from "../utils/helperUtil.js";
import { softDeleteFile } from "../services/recycleBin/index.js";
import {
  s3DeletePreSingedUrl,
  s3GetObjectsInfo,
  s3GetPreSignedUrl,
  s3UploadPresignedUrl,
} from "../services/file/s3Servies.js";
import { errorResponse, successResponse } from "../utils/apiResponse.js";
import { StatusCodes } from "http-status-codes";
import { cloudfrontSignedUrl } from "../services/file/cloudFront.js";
import { importGoogleDrive } from "../services/file/index.js";

export const uploadInitiate = async (req, res, next) => {
  const user = req.user;
  const parentFolderId = req.params.id
    ? new ObjectId(req.params.id)
    : user.rootFolderId;
  const { contentType, fileName, size } = req.body;
  try {
    const folder = await Folder.findOne({ _id: parentFolderId });

    if (!folder) {
      return res.json({ error: "Parent folder not found! " });
    }
    const rootFolder = await Folder.findById(req.user.rootFolderId);

    const remainingSpace = user.maxStorageLimite - rootFolder.size;

    if (size > remainingSpace || size > user.maxFileSize) {
      return successResponse(
        res,
        StatusCodes.INSUFFICIENT_STORAGE,
        "NOT MORE SAPCE TO STORE",
      );
    }
    const extension = path.extname(fileName);

    const insertedFile = await File.insertOne({
      name: fileName,
      extension,
      size: size,
      parentFolderId: parentFolderId,
      userId: user._id,
      isUploading: true,
    });

    const fileId = insertedFile.id;

    const fullFileName = `${fileId}${extension}`;
    const url = await s3UploadPresignedUrl(fullFileName, contentType);

    return successResponse(res, StatusCodes.OK, {
      fileId: fileId,
      uploadUrl: url,
    });
  } catch (error) {
    next(error);
  }
};

export const uploadCompleted = async (req, res, next) => {
  const fileId = new ObjectId(req.params.fileId);
  const fileData = await File.findById(fileId);
  if (!fileData) {
    return errorResponse(res, StatusCodes.NOT_FOUND, "This file is  not found");
  }
  const fileKey = `${fileData._id}${fileData.extension}`;
  try {
    const fileMetaData = await s3GetObjectsInfo({
      key: fileKey,
    });
    if (fileMetaData.ContentLength !== fileData.size) {
      await s3DeletePreSingedUrl({ key: fileKey });
      await fileData.deleteOne();
      return errorResponse(
        res,
        StatusCodes.LENGTH_REQUIRED,
        "File size does not match",
      );
    }
    fileData.isUploading = false;
    await fileData.save();
    await getFolderSize(fileData.parentFolderId, fileData.size);
    return successResponse(res, StatusCodes.OK, "File Upload");
  } catch (error) {
    await s3DeletePreSingedUrl({ key: fileKey });
    await fileData.deleteOne();
    return errorResponse(
      res,
      StatusCodes.NOT_FOUND,
      "The File is not upload propley",
    );
  }
};

export const downloadBulkFiles = async (req, res, next) => {
  try {
    const fileIds = req.body;
    if (!Array.isArray(fileIds) || fileIds.length === 0) {
      return res.status(400).json({ message: "No file IDs provided" });
    }
    const signedUrls = [];

    for (const id of fileIds) {
      const file = await File.findById(id);

      if (!file) {
        console.warn(`File not found: ${id}`);
        continue;
      }

      const downloadUrl = await s3GetPreSignedUrl({
        key: `${file._id}${file.extension}`,
        fileName: file.name,
      });

      signedUrls.push({
        url: downloadUrl,
        fileName: file.name,
      });
    }

    res.json(signedUrls);
  } catch (error) {
    console.error("Bulk download error:", error);
    next(error);
  }
};

export const getFileById = async (req, res) => {
  const id = req.params.id;
  try {
    const fileMetaData = await File.findById(id);

    const parentFolder = await Folder.findOne({
      _id: fileMetaData.parentFolderId,
      userId: req.user._id,
    }).lean();
    if (!parentFolder) {
      return res.status.json({ error: "You don't have access to this file." });
    }
    if (!fileMetaData) {
      return res.status(404).json({ error: "not found this file" });
    }
    const filePath = `${id}${fileMetaData.extension}`;

    if (req.query.action === "download") {
      const downloadFileUrl = await s3GetPreSignedUrl({
        key: filePath,
        download: true,
        fileName: fileMetaData.name,
      });
      return res.redirect(downloadFileUrl);
    }

    const getUrl = await cloudfrontSignedUrl({
      key: filePath,
      fileName: fileMetaData.name,
    });
    return res.redirect(getUrl);
  } catch (error) {
    res.status(501).json(error);
  }
};

export const renameFileName = async (req, res, next) => {
  const id = req.params.id;
  const fileName = req.body?.name;
  if (!fileName) {
    return res.status(403).json({ error: "file name is not found " });
  }
  try {
    await File.findOneAndUpdate(
      { _id: new ObjectId(id), userId: req.user._id },
      { $set: { name: fileName } },
    );
    res.status(201).json({ success: "file renamed" });
  } catch (error) {
    next();
  }
};

export const recycledFilebyId = async (req, res, next) => {
  const fileId = new ObjectId(req.params.id);
  const userId = req.user._id;
  try {
    await softDeleteFile(fileId, userId);
    res
      .status(200)
      .json({ success: true, message: "file moved to recycle bin" });
  } catch (error) {
    next(error);
  }
};

export const importFormGoogleDive = async (req, res, next) => {
  const { rootFolderId, _id: userId, maxFileSize, maxStorageLimite } = req.user;

  const { files } = req.body;
  if (!Array.isArray(files) || !files.length) {
    return errorResponse(res, StatusCodes.NOT_FOUND, "No files provided");
  }
  try {
    for (const file of files) {
      const { id: fileId, name, mimeType, size, accessToken } = file;
      if (!fileId || !accessToken) {
        return errorResponse(
          res,
          StatusCodes.NOT_FOUND,
          "Missing fileId or accessToken",
        );
      }
      const rootFolder = await Folder.findById(rootFolderId);
      const remainingSpace = maxStorageLimite - rootFolder.size;
      if (size > remainingSpace || size > maxFileSize) {
        return successResponse(
          res,
          StatusCodes.INSUFFICIENT_STORAGE,
          "NOT MORE SAPCE TO STORE",
        );
      }
      await importGoogleDrive(
        fileId,
        name,
        mimeType,
        size,
        accessToken,
        rootFolderId,
        userId,
      );
    }
    successResponse(res, StatusCodes.CREATED, "File upload completed");
  } catch (error) {
    next(error);
  }
};
