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

const router = express.Router();

router.post("/files/{:fileId}/link", shareWithPublicLink);

router.patch("/file/{:fileId}/link/toggle", shareFileToggle);

router.patch("/file/{:fileId}/link/permissions", shareWithLinkPermissionChange);

router.get("/public/file/{:fileId}", getShareWithLink);

router.get("/file/{:shareId}", getShareFileInfo);

router.post("/file/{:fileId}/email/invite", shareInviteWithEmail);

router.get(
  "/files/{:fileId}/email-share",
  validateEmailShare,
  getShareFileWithEmailData,
);
router.get("/files/{:fileId}/stream", validateEmailShare, streamSharedFile);

export default router;
