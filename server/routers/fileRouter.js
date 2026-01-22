import express from "express"
import { getFileById, uploadNewFile } from "../controllers/fileController.js"
import upload from "../utils/multer.js"


const router = express.Router()



router.post("/:id", uploadNewFile)

router.get("/:id", getFileById)

export default router