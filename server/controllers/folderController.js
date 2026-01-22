import File from "../models/fileModel.js"
import Folder from "../models/folderModel.js "
import { ObjectId } from "mongodb"

export const createNewFolder = async (req, res, next) => {
    const user = req.user
    try {
        const parentFolderId = req.params.id ? new ObjectId(req.params.id) : user.rootFolderId
        const folderName = req.body.folderName
        if (!folderName) {
            return res.status(401).json({ error: "folder name not recived" })
        }
        const isfolder = await Folder.findById(parentFolderId)

        if (!isfolder) {
            return res.status(403).json({ error: "parent folder is not found" })
        }
        await Folder.create({
            userId: user._id,
            name: folderName,
            parentFolderId,
        })
        res.status(201).json({ success: "Folder created." })
    } catch (error) {
        next();
    }
}

export const getAllFolders = async (req, res, next) => {
    const user = req.user
    try {
        const _id = req.params.id ? new ObjectId(req.params.id) : user.rootFolderId

        const folder = await Folder.findById(_id)

        if (!folder) {
            res.status(404).json({ error: "Folder not found or you do not have access to it!" })
        }
        const fileData = await File.find({ parentFolderId: folder._id }).select({ __v: 0 })
        const folderData = await Folder.find({ parentFolderId: _id }).select({ __v: 0 })

        res.status(200).json({ data: { folders: folderData, files: fileData } })
    } catch (error) {
        next()
    }
}