import express from "express";
import {
  downloadBulkFiles,
  getFileById,
  importFormGoogleDive,
  recycledFilebyId,
  renameFileName,
  uploadCompleted,
  uploadInitiate,
} from "../controllers/fileController.js";
import vaildldMidleware from "../middlewares/vaildldMidleware.js";
import { Limiter } from "../utils/RateLimiter.js";


const router = express.Router();

router.post("/upload/initiate/{:id}", Limiter.fileUpload(),  uploadInitiate);

router.post("/upload/completed/{:fileId}",  uploadCompleted);

router.get("/{:id}", Limiter.fileGet() , vaildldMidleware, getFileById);

router.patch("/{:id}", Limiter.fileRename(), renameFileName);

router.post("/bulk/download", Limiter.fileDownload(), downloadBulkFiles);

router.patch("/{:id}/delete", Limiter.fileDelete(), recycledFilebyId);

router.post("/drive-import", Limiter.driveImport(), importFormGoogleDive);

export default router;
