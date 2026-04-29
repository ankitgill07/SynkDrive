import express from "express";
import {
  createNewFolder,
  getAllFolders,
  renameFolderName,
  softDeleteFolderData,
} from "../controllers/folderController.js";
import vaildldMidleware from "../middlewares/vaildldMidleware.js";

const router = express.Router();

router.post("/{:id}", createNewFolder);

router.get("/{:id}", getAllFolders);

router.patch("/{:id}", vaildldMidleware, renameFolderName);

router.put("/{:id}", softDeleteFolderData);

export default router;
