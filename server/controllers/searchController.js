import File from "../models/fileModel.js";
import Folder from "../models/folderModel.js ";

export const searchQuery = async (req, res, next) => {
  const { query } = req.params;
  const user = req.user._id;
const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const regex = new RegExp("^" + escaped, "i");
  try {
    const file = await File.find({
      name: regex,
      isDeleted: false,
    });
    const folder = await Folder.find({
      name: regex,
      isDeleted: false,
    });
    res.status(200).json({ data: { folders: folder, files: file } });
  } catch (error) {
    res.status(403).json(error);
  }
};
