import Sessions from "../models/sessionModel"
import Users from "../models/userModel"

export async function checkAuth(req, res, next) {
    const { sid } = req.signedCookies
    if (!sid) {
        return res.status(401).json({ error: "User not found" })
    }
    const session = await Sessions.findById(sid)
    if (!session) {
        return res.status(401).json({ error: "User not found" })
    }
    const user = await Sessions.findById(session.userId)
    if (user) {
        return res.status(401).json({ error: "User not found" })
    }
    res.user = user
    next()
} 