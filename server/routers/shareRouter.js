import express from "express";
import {
  getShareFileInfo,
  getShareFileWithEmailData,
  getShareWithLink,
  shareFileToggle,
  shareInviteWithEmail,
  shareWithLinkPermissionChange,
  shareWithPublicLink,
  streamSharedFile,
} from "../controllers/shareContoller.js";
import { validateEmailShare } from "../middlewares/vaildldMidleware.js";
import { Limiter } from "../utils/RateLimiter.js";

const router = express.Router();

router.post(
  "/files/{:fileId}/link",
  Limiter.fileShareLink(),
  shareWithPublicLink,
);

router.patch(
  "/file/{:fileId}/link/toggle",
  Limiter.fileShareToggle(),
  shareFileToggle,
);

router.patch(
  "/file/{:fileId}/link/permissions",
  Limiter.fileSharePermission(),
  shareWithLinkPermissionChange,
);

router.get(
  "/public/file/{:fileId}",
  Limiter.filePublicAccess(),
  getShareWithLink,
);

router.get("/file/{:shareId}", Limiter.filePublicAccess(), getShareFileInfo);

router.post(
  "/file/{:fileId}/email/invite",
  Limiter.fileEmailInvite(),
  shareInviteWithEmail,
);

router.get(
  "/files/{:fileId}/email-share",
  Limiter.fileShareEmail(),
  validateEmailShare,
  getShareFileWithEmailData,
);
router.get(
  "/files/{:fileId}/stream",
  Limiter.fileStream(),
  validateEmailShare,
  streamSharedFile,
);

export default router;
