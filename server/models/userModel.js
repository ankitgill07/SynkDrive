import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minLength: 3,
    },
    email: {
      type: String,
      required: true,
      pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      unique: true,
    },
    password: {
      type: String,
    },
    picture: {
      type: String,
      default: function () {
        const encodedName = encodeURIComponent(this.name || "User");
        return `https://api.dicebear.com/7.x/initials/svg?seed=${encodedName}`;
      },
    },
    rootFolderId: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    maxStorageLimite: {
      type: Number,
      required: true,
      default: 1 * 1024 ** 3,
    },
    loginWithPassword: {
      type: Boolean,
      required: true,
    },
    role: {
      type: String,
      enum: ["SuperAdmin", "Admin", "Manger", "User"],
      default: "User",
    },
    createdWith: {
      type: String,
      enum: ["email", "google", "github"],
      required: true,
    },
    isDisable: {
      type: Boolean,
      default: false,
      required: true,
    },
    maxFileSize: {
      type: Number,
      default: 200 * 1024 ** 2,
    },
    subscriptionsId: {
      type: String,
      ref: "subscription",
      default: null,
    },
    restoreFileDays: {
      type: Number,
      default: 30,
    },
    maxDeviceLimit: {
      type: Number,
      default: 2,
    },
    trems: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.methods.comparePassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 12);
});

const Users = mongoose.model("user", userSchema);

export default Users;
