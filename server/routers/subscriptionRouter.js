import express from "express";
import {
  createSubscription,
  subscriptionPaused,
  subscriptionResumed,
  subscriptionStatus,
} from "../controllers/subscriptionController.js";
import { Limiter } from "../utils/RateLimiter.js";

const router = express.Router();

router.post("/create", Limiter.subscriptionCreate(), createSubscription);

router.get("/status", Limiter.subscriptionStatus(), subscriptionStatus);

router.patch("/paused", Limiter.subscriptionPause(), subscriptionPaused);

router.patch("/resumed", Limiter.subscriptionResume(), subscriptionResumed);

export default router;
