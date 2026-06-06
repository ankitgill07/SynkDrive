import Subscription from "../models/subscriptionModal.js";
import Users from "../models/userModel.js";
import { getPlanById, PLANS } from "../utils/getPlanDetails.js";
import {handleRazorpayWebhookEvents} from "../services/webhooks/index.js";
import webhookEvent from "../models/webhookEventModal.js";
import { validateWebhookSignature } from "razorpay/dist/utils/razorpay-utils.js";
import { StatusCodes } from "http-status-codes";

export const verifySubscriptionPaymentWithWebhook = async (req, res, next) => {
  let webhookRecord = null;

  try {
    const webhookBody = req.body;
    const webhookSignature = req.headers["x-razorpay-signature"];
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    const isSignatureValid = validateWebhookSignature(
      JSON.stringify(webhookBody),
      webhookSignature,
      webhookSecret,
    );

    if (!isSignatureValid) {
      console.error("[Webhook] Signature verification failed");
      return res.status(StatusCodes.UNAUTHORIZED).json({
        error: "Webhook signature verification failed",
      });
    }

    const event = webhookBody?.event;
    const userId = webhookBody?.payload?.subscription?.entity?.notes?.userId;

    if (!event || !userId) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: "Missing event or userId in webhook payload",
      });
    }

    webhookRecord = await webhookEvent.create({
      userId,
      razorpaySubscription: webhookBody.payload.subscription.entity.id,
      eventType: event,
      signature: webhookSignature,
      payload: webhookBody,
      status: "pending",
    });

    console.log(`[Webhook] Processing event: ${event} for user: ${userId}`);

    const result = await handleRazorpayWebhookEvents(event, webhookBody);

    webhookRecord.status = "processed";
    webhookRecord.responseMessage = JSON.stringify(result);
    webhookRecord.processedAt = new Date();
    await webhookRecord.save();

    console.log(`[Webhook] Event processed successfully: ${event}`);

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Webhook processed successfully",
      event,
    });
  } catch (error) {
    console.error("[Webhook] Error processing webhook:", error.message);

    if (webhookRecord) {
      webhookRecord.status = "failed";
      webhookRecord.responseMessage = error.message;
      webhookRecord.processedAt = new Date();
      try {
        await webhookRecord.save();
      } catch (saveError) {
        console.error(
          "[Webhook] Failed to save webhook error status:",
          saveError.message,
        );
      }
    }

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Failed to process webhook",
      message: error.message,
    });
  }
};
