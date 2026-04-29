import { handleActivatedEvent } from "./handleActivatedEvent.js";
import { handleCancelledEvent } from "./handleCancelledEvent.js";
import { handlePausedEvent } from "./handlePausedEvent.js";
import { handleResumedEvent } from "./handleResumedEvent.js";

export const handlleRazorpayWebhookEvents = async (event, webhookData) => {
  switch (event) {
    case "subscription.activated":
      await handleActivatedEvent(webhookData);
      break;

    case "subscription.paused":
      await handlePausedEvent(webhookData);
      break;

    case "subscription.resumed":
      await handleResumedEvent(webhookData);
      break;
    case "subscription.cancelled":
      await handleCancelledEvent(webhookData);
      break;

    default:
      console.log("Unhandled event:", event);
  }
};
