import mongoose, { model } from "mongoose";

const folderSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    size: {
      type: Number,
      required: true,
      default: 0,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    isStarred: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: "folder",
    },
    deletedByParent: {
      type: Boolean,
      default: false,
    },
    path: [{ type: mongoose.Types.ObjectId, ref: 'folder'  }],
    parentFolderId: {
      type: mongoose.Types.ObjectId,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

const Folder = mongoose.models.folder || model("folder", folderSchema);

export default Folder;
