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

const router = express.Router();

router.patch("/setPassword", setManaulLoginPassword);

router.patch("/password/update", updateUserPassword);

router.patch("/update", upload.single("file"), updateProfile);

router.post("/logout", userLogout);

router.post("/disable", disableUserAccount);

router.get("/profile", getUserProfile);

router.delete("/all-device-logout", logoutForAllDevices);

router.delete("/session/{:sid}", logoutDevicesBySid);

router.delete("/account-deleted", deleteAccountPermanetly);

export default router;
