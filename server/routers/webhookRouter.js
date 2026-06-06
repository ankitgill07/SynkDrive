import express from "express";
import { verifySubscriptionPaymentWithWebhook } from "../controllers/webhookController.js";

const router = express.Router();

router.post("/payments", verifySubscriptionPaymentWithWebhook);

export default router;

