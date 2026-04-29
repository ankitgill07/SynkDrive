import express from "express";
import { verfiySubscriptionPaymentWithWebhook } from "../controllers/webhookController.js";

const router = express.Router();

router.post("/payments", verfiySubscriptionPaymentWithWebhook);

export default router;

