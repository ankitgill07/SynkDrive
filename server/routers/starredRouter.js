import express from "express"
import { getAllStarredItmes , addFileToStarred, addFolderTreeToStarred} from "../controllers/starredController.js "
import { _1m, RateLimiter } from "../utils/RateLimiter.js"

const router = express.Router()

router.get("/" , RateLimiter({windowTimeInMs : _1m , limit : 50}), getAllStarredItmes)

router.patch("/file/{:id}" , RateLimiter({windowTimeInMs : 10 * _1m  , limit : 15}), addFileToStarred)

router.patch("/folder/{:id}" , RateLimiter({windowTimeInMs : 15 *  _1m , limit : 10}), addFolderTreeToStarred)

export default router