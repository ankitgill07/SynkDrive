import Razorpay from "razorpay";
import Subscription from "../models/subscriptionModal.js";
import Users from "../models/userModel.js";
import { getPlanById, PLANS } from "../utils/getPlanDetails.js";
import { handlleRazorpayWebhookEvents } from "../services/webhooks/index.js";

const webhook_Sercet = process.env.RAZORPAY_WEBHOOK_SECRET;

export const verfiySubscriptionPaymentWithWebhook = async (req, res, next) => {
  try {
    const webhookData = req.body;
    const razorpaySignature = req.headers["x-razorpay-signature"];
    const isSignatureVaild = Razorpay.validateWebhookSignature(
      JSON.stringify(webhookData),
      razorpaySignature,
      webhook_Sercet,
    );
    const event = webhookData?.event;
    if (isSignatureVaild) {
      await handlleRazorpayWebhookEvents(event, webhookData);
      res.sendStatus(200);
    } else {
      console.log("Webhook verification failed");
      res.sendStatus(400);
    }
  } catch (error) {
    next(error);
  }
};
