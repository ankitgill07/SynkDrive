import path from "path"
import File from "../models/fileModel.js"
import Folder from "../models/folderModel.js "
import { ObjectId } from "mongodb"
import { createWriteStream } from "fs"

export const uploadNewFile = async (req, res) => {
  const user = req.user
  const parentFolderId = new ObjectId(req.params.id) || user.rootFolderId

  try {

    const folder = await Folder.findOne({ _id: parentFolderId }).lean()

    if (!folder) {
      return res.json({ error: "Parent folder not found! " })
    }

    const fileName = req.get("x-file-name")
    const fileSize = req.get("size")

    const extension = path.extname(fileName)

    const insertedFile = await File.insertOne({
      name: fileName,
      extension,
      size: fileSize,
      parentFolderId: parentFolderId,
      userId: user._id,
    })

    const fileId = insertedFile.id;

    const fullFileName = `${fileId}${extension}`;

    const writeStream = createWriteStream(`./uploads/${fullFileName}`);
    req.pipe(writeStream);

    writeStream.on("finish", async () => {
      return res.status(201).json({ message: "File Uploaded" });
    });
  } catch (error) {
    console.log(error);

  }

}

export const getFileById = async (req, res) => {
  const id = req.params.id
  try {
    const fileMetaData = await File.findById(id)

    const parentFolder = await Folder.findOne({ _id: fileMetaData.parentFolderId, userId: req.user._id }).lean()
    if (!parentFolder) {
      return res.status.json({ error: "You don't have access to this file." })
    }
    if (!fileMetaData) {
      return res.status(404).json({ error: "not found this file" })
    }

    const filePath = `${process.cwd()}/uploads/${id}${fileMetaData.extension}`

    return res.sendFile(filePath, (err) => {
      if (!res.headersSent && err) {
        return res.status(404).json({ error: "File not found!" });
      }
    })
  } catch (error) {
    res.status(501).json(error)
  }

}