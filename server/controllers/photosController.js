import File from "../models/fileModel.js";

export const getOnlyAllPhotos = async (req, res) => {
  try {
    const photos = await File.find({isDeleted : false, extension: { $in: [".png", ".jpg", ".jpeg", ".webp"]}});
  res.status(200).json({ photos });
  } catch (error) {
    res.status(403).json(error)
  }
};
