import express from "express"
import { getAllStarredItmes , addFileToStarred, addFolderTreeToStarred} from "../controllers/starredController.js "


const router = express.Router()

router.get("/" , getAllStarredItmes)

router.patch("/file/{:id}" , addFileToStarred)

router.patch("/folder/{:id}" , addFolderTreeToStarred)

export default router