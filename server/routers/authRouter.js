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
import { _1m, Limiter, RateLimiter } from "../utils/RateLimiter.js";

const router = express.Router();

router.post("/register", Limiter.register(), userRegister);

router.post("/login", Limiter.login(), userLogin);

router.get(
  "/",
  checkAuth,
  Limiter.getProfile(),
  userInfoData,
);

router.post("/send-otp", Limiter.otp(), sendVerificationCode);

router.post("/google", Limiter.socialLogin(), loginWithgoogleAuth);

router.get("/github", Limiter.socialLogin(), redirectToAuthURL);

router.get("/github/callback", Limiter.socialLogin(), loginWithgithubAuth);

export default router;
