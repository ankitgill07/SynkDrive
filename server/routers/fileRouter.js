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

const router = express.Router();

router.post("/upload/initiate/{:id}", uploadInitiate);

router.post("/upload/completed/{:fileId}", uploadCompleted);

router.get("/{:id}", vaildldMidleware, getFileById);

router.patch("/{:id}", renameFileName);

router.post("/bulk/download", downloadBulkFiles);

router.patch("/{:id}/delete", recycledFilebyId);

router.post("/drive-import", importFormGoogleDive);

export default router;
