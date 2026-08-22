import mongoose, { model } from "mongoose";

const emailShareSchema = new mongoose.Schema(
  {
    fileId: {
      type: mongoose.Types.ObjectId,
      ref: "file",
      required: true,
    },
    sharedBy: {
      type: mongoose.Types.ObjectId,
      ref: "user",
      required: true,
    },
    sharedWith: [
      {

        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "user",
          required: true,
        },
        permission: {
          type: String,
          enum: ["viewer", "editor"],
          default: "viewer",
        },
        accessTokenHash: {
          type: String,
          required: true,
        },
      },
    ],
    message: {
      type: String,
      default: null,
    },
    isRevoked: {
      type: Boolean,
      default: false,
    },
    expiresAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

const emailShare = model("emailShare", emailShareSchema);
export default emailShare;
