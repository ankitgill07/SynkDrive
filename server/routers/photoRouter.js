import express from "express"
import { getOnlyAllPhotos } from "../controllers/photosController.js"
import { Limiter } from "../utils/RateLimiter.js"

const router = express.Router()

router.get("/" , Limiter.fileGet(), getOnlyAllPhotos)

export default router