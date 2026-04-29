import express from "express"
import { getOnlyAllPhotos } from "../controllers/photosController.js"

const router = express.Router()

router.get("/" , getOnlyAllPhotos)

export default router