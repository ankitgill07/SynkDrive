import express from "express"
import { createNewFolder, getAllFolders } from "../controllers/folderController.js"


const router = express.Router()


router.post("/:parentFolderId?",  createNewFolder)

router.get("/:id?", getAllFolders)

export default router