import mongoose, { Schema } from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    subscriptions_id: {
      type: String,
      required: true,
    },
    planId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: [
        "created",
        "active",
        "past_due",
        "paused",
        "cancelled",
        "pending",
        "renewal_failed",
      ],
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
      index: true,
    },
    invoiceId: {
      type: String,
      default: null,
    },
    currentStart: {
      type: Date,
      default: null,
    },
    currentEnd: {
      type: Date,
      default: null,
    },
    cancelledAt: {
      type: Date,
      default: null,
    },
    pausedAt: {
      type: Date,
      default: null,
    },
    resumeAt: {
      type: Date,
      default: null,
    },
    startAt: {
      type: Date,
    },

    endAt: {
      type: Date,
    },
  },
  {
    strict: "throw",
    timestamps: true,
  },
);

const Subscription = mongoose.model("subscription", subscriptionSchema);

export default Subscription;
