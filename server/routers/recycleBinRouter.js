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
import { _1m, Limiter, RateLimiter } from "../utils/RateLimiter.js";

const router = express.Router();

router.get("/", Limiter.recycleGet(), getRecyleBinData);

router.patch("/bulk/restore", Limiter.restoreBulk(), bulkRestoreData);

router.patch("/restore/{:id}", Limiter.restoreSingle(), restoreData);

router.patch(
  "/restore/folder/{:id}",
  RateLimiter({ windowTimeInMs: 5 * _1m, limit: 15 }),
  restoreFolder,
);

router.delete(
  "/delete/folder/{:folderId}",
  Limiter.folderDelete(),
  deleteFolderParmanetly,
);

router.delete(
  "/bulk/delete/parmanetly",
  Limiter.folderBulkDelete(),
  bulkDeleteParmanetly,
);

router.delete(
  "/delete/file/{:id}",
  Limiter.filePermanentDelete(),
  deletedPermanetly,
);

router.get(
  "/{:folderId}",
  RateLimiter({ windowTimeInMs: _1m, limit: 10 }),
  getRecyleDataById,
);

router.patch("/bulk/delete", Limiter.BulkDelete(), bulkSoftDeleteItems);

export default router;
