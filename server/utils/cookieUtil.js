import redisClient from "../db/redisDB.js"
import Sessions from "../models/sessionModel.js"


export const setUserCookie = async (res, userId) => {
    try {
        const sessionId = crypto.randomUUID()
        const redisKey = `session:${sessionId}`
        await redisClient.json.set(redisKey, "$", { userId })
        res.cookie("sid", sessionId, {
            httpOnly: true,
            signed: true,
            maxAge: 1000 * 60 * 60 * 24 * 7,
            sameSite: "lax"
        })
    } catch (error) {
        console.log(error);
    }
}