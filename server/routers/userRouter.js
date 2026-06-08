import express from "express";
import {
  deleteAccountPermanetly,
  disableUserAccount,
  getAllSessions,
  getUserProfile,
  logoutDevicesBySid,
  logoutForAllDevices,
  setManaulLoginPassword,
  updateProfile,
  updateUserPassword,
  userLogout,
} from "../controllers/userController.js";
import upload from "../utils/multer.js";
import { Limiter } from "../utils/RateLimiter.js";

const router = express.Router();

router.patch("/setPassword", Limiter.setPassword(), setManaulLoginPassword);

router.patch("/password/update", Limiter.updatePassword(), updateUserPassword);

router.patch(
  "/update",
  Limiter.updateProfile(),
  upload.single("file"),
  updateProfile,
);

router.post("/logout", Limiter.logout(), userLogout);

router.post("/disable", Limiter.disableAccount(), disableUserAccount);

router.get("/profile", Limiter.getProfile(), getUserProfile);

router.delete(
  "/all-device-logout",
  Limiter.logoutAllDevices(),
  logoutForAllDevices,
);

router.delete("/session/{:sid}", Limiter.deleteSession(), logoutDevicesBySid);

router.delete(
  "/account-deleted",
  Limiter.deleteAccount(),
  deleteAccountPermanetly,
);

export default router;
