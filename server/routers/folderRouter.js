import express from "express";
import {
  createNewFolder,
  getAllFolders,
  renameFolderName,
  softDeleteFolderData,
} from "../controllers/folderController.js";
import vaildldMidleware from "../middlewares/vaildldMidleware.js";
import { Limiter } from "../utils/RateLimiter.js";

const router = express.Router();

router.post("/{:id}", Limiter.folderCreate(), createNewFolder);

router.get("/{:id}", Limiter.folderGet(), getAllFolders);

router.patch(
  "/{:id}",
  Limiter.folderRename(),
  vaildldMidleware,
  renameFolderName,
);

router.put("/{:id}", Limiter.folderDelete(), softDeleteFolderData);

export default router;
