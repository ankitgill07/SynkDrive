import express from "express"
import { createSubscription, subscriptionPaused, subscriptionResumed, subscriptionStatus} from "../controllers/subscriptionController.js"

const router = express.Router()

router.post('/create' , createSubscription)

router.get("/status" ,  subscriptionStatus)

router.patch('/paused' , subscriptionPaused)

router.patch("/resumed" , subscriptionResumed)

export default router