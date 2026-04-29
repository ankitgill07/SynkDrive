import express from "express";
import {
  bulkDeleteParmanetly,
  bulkRestoreData,
  bulkSoftDeleteItems,
  deletedPermanetly,
  deleteFolderParmanetly,
  getRecyleBinData,
  getRecyleDataById,
  restoreData,
  restoreFolder,
} from "../controllers/recycleBinController.js";

const router = express.Router();

router.get("/", getRecyleBinData);

router.patch("/bulk/restore", bulkRestoreData);

router.patch("/restore/{:id}", restoreData);

router.patch("/restore/folder/{:id}", restoreFolder);

router.delete("/delete/folder/{:folderId}", deleteFolderParmanetly);

router.delete("/bulk/delete/parmanetly", bulkDeleteParmanetly);

router.delete("/delete/file/{:id}", deletedPermanetly);

router.get("/{:folderId}", getRecyleDataById);

router.patch("/bulk/delete", bulkSoftDeleteItems);

export default router;
