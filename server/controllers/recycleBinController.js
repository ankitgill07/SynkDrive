import File from "../models/fileModel.js";
import { ObjectId } from "mongodb";
import Folder from "../models/folderModel.js ";
import { rm } from "fs/promises";
import { $ZodObjectJIT } from "zod/v4/core";
import { getFolderSize } from "../utils/helperUtil.js";
import { file } from "zod/v4";
import {
  softDeleteFolder,
  softDeleteFile,
  folderDeleteParmanetly,
  filesDeletParmanetly,
  restoreFolderOrFile,
  restoreFiles,
} from "../services/recycleBin/index.js";

import { successResponse } from "../utils/apiResponse.js";
import { StatusCodes } from "http-status-codes";
import {
  s3DeleteObjects,
  s3DeletePreSingedUrl,
} from "../services/file/s3Servies.js";
import { all } from "axios";

export const getRecyleBinData = async (req, res) => {
  const rootFolder = await Folder.find({
    userId: req.user._id,
    isDeleted: true,
    deletedByParent: false,
  }).lean();
  const rootFile = await File.find({
    userId: req.user._id,
    isDeleted: true,
    deletedByParent: false,
  });
  res.status(200).json({ rootFolder, rootFile });
};

export const getRecyleDataById = async (req, res) => {
  const id = req.params.folderId;
  try {
    async function getSubData(folderId) {
      const folders = await Folder.find({
        parentFolderId: folderId,
        isDeleted: true,
        deletedByParent: true,
      }).lean();
      const files = await File.find({
        parentFolderId: folderId,
        isDeleted: true,
        deletedByParent: true,
      });
      let allFolders = [...folders];
      let allFiles = [...files];

      for (const sub of folders) {
        const nestedData = await getSubData(sub._id);
        allFolders = [...allFolders, ...nestedData.folders];
        allFiles = [...allFiles, ...nestedData.files];
      }
      return { folders: allFolders, files: allFiles };
    }
    const data = await getSubData(id);
    res.status(200).json(data);
  } catch (error) {
    res.status(403).json(error);
  }
};
export const restoreData = async (req, res, next) => {
  const fileId = new ObjectId(req.params.id);
  const userId = req.user._id;
  try {
    await restoreFiles(fileId, userId);
    successResponse(res, StatusCodes.CREATED, "item restore successfuly");
  } catch (error) {
    next(error);
  }
};

export const restoreFolder = async (req, res, next) => {
  const id = new ObjectId(req.params.id);
  try {
    await restoreFolderOrFile(id);
    successResponse(res, StatusCodes.ACCEPTED, "Folder restore success");
  } catch (error) {
    next(error);
  }
};

export const bulkRestoreData = async (req, res, next) => {
  const ids = req.body;
  const userId = req.user._id;
  try {
    for (const id of ids) {
      const folder = await Folder.findById(id);
      if (folder) {
        await restoreFolderOrFile(folder._id);
        continue;
      }
      const file = await File.findById(id);

      if (file) {
        await restoreFiles(file._id, userId);
      }
    }
    return successResponse(
      res,
      StatusCodes.OK,
      `moved ${file.length} recycleBin Successfuly`,
    );
  } catch (error) {
    next(error);
  }
};

export const deletedPermanetly = async (req, res, next) => {
  const fileId = new ObjectId(req.params.id);
  const userId = res.user._id;
  try {
    await filesDeletParmanetly(fileId, userId);
    successResponse(res, StatusCodes.NO_CONTENT, "File delete sucessfuly");
  } catch (error) {
    next(error);
  }
};

export const deleteFolderParmanetly = async (req, res) => {
  const id = new ObjectId(req.params.folderId);
  const userId = req.user._id;
  try {
    await folderDeleteParmanetly(id, userId);
    return successResponse(
      res,
      StatusCodes.NO_CONTENT,
      "folder deleted successfuly",
    );
  } catch (error) {
    return res.status(403).json({ error: error });
  }
};

export const bulkSoftDeleteItems = async (req, res, next) => {
  try {
    const ids = req.body;
    const userId = req.user._id;
    for (const id of ids) {
      const folder = await Folder.findById(id);
      if (folder) {
        await softDeleteFolder(folder._id);
        continue;
      }
      const file = await File.findById(id);

      if (file) {
        await softDeleteFile(file._id, userId);
      }
    }
    return successResponse(
      res,
      StatusCodes.OK,
      `moved ${file.length} recycleBin Successfuly`,
    );
  } catch (error) {
    next(error);
  }
};

export const bulkDeleteParmanetly = async (req, res, next) => {
  try {
    const allId = req.body.allId;
    const userId = req.user._id;
    if (!allId || !Array.isArray(allId) || allId.length === 0) {
      return res
        .status(400)
        .json({ message: "allId is required and must be a non-empty array" });
    }
    for (const id of allId) {
      const folder = await Folder.findById(id);
      if (folder) {
        await folderDeleteParmanetly(folder._id, userId);
        continue;
      }
      const file = await File.findById(id);
      if (file) {
        await filesDeletParmanetly(file._id, userId);
      }
    }
    return successResponse(
      res,
      StatusCodes.OK,
      `moved ${file.length} recycleBin Successfuly`,
    );
  } catch (error) {
    next(error);
  }
};
