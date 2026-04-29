import mongoose, { model } from "mongoose";

const linkShareSchema = new mongoose.Schema(
  {
    fileId: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    sharedBy: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    isEnabled: {
      type: Boolean,
      default: false,
    },
    token: {
      type: String,
      unique: true,
      sparse: true,
    },
    permissions: {
      type: String,
      enum: ["viewer", "editor"],
      default: "viewer",
    },
    isRevoked: {
      type: Boolean,
      default: false,
    },
    expiresAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

const linkShare = model("linkShare", linkShareSchema);
export default linkShare;
