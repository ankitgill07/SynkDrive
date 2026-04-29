import mongoose, { model } from "mongoose";

const fileSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    extension: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
      default: 0,
    },
    type: {
      type: String,
      default: "file",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedByParent: {
      type: Boolean,
      default: false,
    },
    isStarred: {
      type: Boolean,
      default: false,
    },
    parentFolderId: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
    },
    isUploading: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
  },
);

const File = model("file", fileSchema);

export default File;
