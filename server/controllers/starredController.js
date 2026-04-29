import File from "../models/fileModel.js";
import Folder from "../models/folderModel.js ";
import { ObjectId } from "mongodb";


export const getAllStarredItmes = async (req, res) => {
  try {
    const folders = await Folder.find({
      isStarred: true,
      isDeleted: false,
    }).lean();
    const files = await File.find({ isStarred: true, isDeleted: false }).lean();
    res.status(200).json({folders , files});
  } catch (error) {
    res.status(403).json(error);
  }
};

export const addFileToStarred = async (req, res) => {
  const fileId = new ObjectId(req.params.id);
  try {
    await File.findOneAndUpdate(
      { _id: fileId, userId: req.user._id },
      { $set: { isStarred: req.body.value } },
      { new: true } 
    );
    res.json({ success: "file add to Starred" });
  } catch (error) {
    res.json({ error: "not add  to starred" });
  }
};

export const addFolderTreeToStarred = async (req, res) => {
  const id = new ObjectId(req.params.id);
  try {
    await Folder.findByIdAndUpdate(
      { _id: id, userId: req.user._id },
      {
        $set: { isStarred: req.body.value },
      },
      { new: true } 
    );
    res.status(201).json({ success: "folder add to Starred" });
  } catch (error) {
    res.status(403).json({ error: "not add to Starred" });
  }
};


