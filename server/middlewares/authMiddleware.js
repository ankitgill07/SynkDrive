import redisClient from "../db/redisDB.js"
import Sessions from "../models/sessionModel.js"
import Users from "../models/userModel.js"

export async function checkAuth(req, res, next) {
    const { sid } = req.signedCookies
    try {
        if (!sid) {
            return res.status(401).json({ error: "User not found" })
        }
        const session = await redisClient.json.get(`session:${sid}`)
        if (!session) {
            return res.status(401).json({ error: "User not found" })
        }
        const user = await Users.findById(session.userId)

        if (!user) {
            return res.status(401).json({ error: "User not found" })
        }
        req.user = user
        next()
    } catch (error) {
        next(error);
    }

} 