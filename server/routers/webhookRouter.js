import express from "express";
import { verifySubscriptionPaymentWithWebhook } from "../controllers/webhookController.js";
import { _1m, RateLimiter } from "../utils/RateLimiter.js";
const router = express.Router();

router.post("/payments",RateLimiter({windowTimeInMs : 10 * _1m , limit : 5}) , verifySubscriptionPaymentWithWebhook);

export default router;

