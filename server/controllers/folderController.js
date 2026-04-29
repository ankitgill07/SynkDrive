import mongoose from "mongoose";
import File from "../models/fileModel.js";
import Folder from "../models/folderModel.js ";
import { ObjectId } from "mongodb";
import { getFolderSize } from "../utils/helperUtil.js";
import { errorResponse, successResponse } from "../utils/apiResponse.js";
import { StatusCodes } from "http-status-codes";
import { softDeleteFolder } from "../services/recycleBin/index.js";

export const createNewFolder = async (req, res, next) => {
  const user = req.user;
  try {
    const parentFolderId = req.params.id
      ? new ObjectId(req.params.id)
      : user.rootFolderId;
    const folderName = req.body.folderName;

    if (!folderName) {
      return errorResponse(
        res,
        StatusCodes.NOT_FOUND,
        "folder name not recived",
      );
    }
    const parentFolder = await Folder.findById(parentFolderId);

    if (!parentFolder) {
      return errorResponse(
        res,
        StatusCodes.NOT_FOUND,
        "parent folder is not found",
      );
    }

    const newId = new ObjectId();
    await Folder.create({
      _id: newId,
      userId: user._id,
      name: folderName,
      path: [...(parentFolder.path || []), newId],
      parentFolderId,
    });
    return successResponse(res, StatusCodes.CREATED, "Folder created.");
  } catch (error) {
    next(error);
  }
};

export const getAllFolders = async (req, res, next) => {
  const user = req.user;
  try {
    const _id = req.params.id ? new ObjectId(req.params.id) : user.rootFolderId;
    const folder = await Folder.findById(_id).populate({
      path: "path",
      select: "name _id",
    });
    if (!folder) {
      return errorResponse(res, StatusCodes.NOT_FOUND, "folder not found");
    }
    const fileData = await File.find({
      parentFolderId: folder._id,
      isDeleted: false,
    }).select({ __v: 0 });
    const folderData = await Folder.find({
      parentFolderId: _id,
      isDeleted: false,
    }).select({
      __v: 0,
    });

    return successResponse(res, StatusCodes.OK, {
      path: folder.path,
      folders: folderData,
      files: fileData,
    });
  } catch (error) {
    next(error);
  }
};

export const renameFolderName = async (req, res, next) => {
  const id = req.params.id;
  const folderName = req.body.name;
  try {
    const folder = await Folder.findOneAndUpdate(
      { _id: new ObjectId(id), userId: req.user._id },
      { $set: { name: folderName } },
    );
    if (!folder) {
      return errorResponse(res, StatusCodes.NOT_FOUND, "folder name not found");
    }
    res.status(201).json({ success: "Folder renamed" });
    return successResponse(res, StatusCodes.CREATED, "Folder renamed");
  } catch (error) {
    next(error);
  }
};

export const softDeleteFolderData = async (req, res) => {
  try {
    const folderId = new mongoose.Types.ObjectId(req.params.id);
    await softDeleteFolder(folderId);
    return res.status(200).json({
      success: true,
      message: "Folder moved to recycle bin",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Soft delete failed",
      error: error.message,
    });
  }
};
