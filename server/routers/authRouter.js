import express from "express";
import {
  redirectToAuthURL,
  loginWithgoogleAuth,
  sendVerificationCode,
  userInfoData,
  userLogin,
  userRegister,
  loginWithgithubAuth,
} from "../controllers/authController.js";
import { checkAuth } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", userRegister);

router.post("/login", userLogin);

router.get("/", checkAuth, userInfoData);

router.post("/send-otp", sendVerificationCode);

router.post("/google", loginWithgoogleAuth);

router.get("/github", redirectToAuthURL);

router.get("/github/callback", loginWithgithubAuth);

export default router;
