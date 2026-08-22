import express from "express";
import {
  createSubscription,
  verifySubscription,
  activateFreePlan,
  subscriptionPaused,
  subscriptionResumed,
  subscriptionCancel,
  subscriptionStatus,
} from "../controllers/subscriptionController.js";
import { Limiter } from "../utils/RateLimiter.js";

const router = express.Router();

router.post("/create", Limiter.subscriptionCreate(), createSubscription);

router.post("/verify", Limiter.subscriptionVerify(), verifySubscription);

router.post("/activate-free", Limiter.subscriptionFree(), activateFreePlan);

router.get("/status", Limiter.subscriptionStatus(), subscriptionStatus);

router.patch("/paused", Limiter.subscriptionPause(), subscriptionPaused);

router.patch("/resumed", Limiter.subscriptionResume(), subscriptionResumed);

router.patch("/cancel", Limiter.subscriptionCancel(), subscriptionCancel);

export default router;

