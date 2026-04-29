import mongoose, { model } from "mongoose";

const emailShareSchema = new mongoose.Schema(
  {
    fileId: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    sharedBy: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
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
emailShareSchema.index({ fileId: 1, email: 1 }, { unique: true });
emailShareSchema.index({ accessTokenHash: 1 });
const emailShare = model("emailShare", emailShareSchema);
export default emailShare;
