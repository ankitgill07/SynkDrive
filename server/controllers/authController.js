
import Sessions from "../models/sessionModel.js"
import Users from "../models/userModel.js"
import { sendOtpServService } from "../services/sendOptService.js"
import OTP from "../models/otpModel.js"
import { googleAuth } from "../services/GoogleAuthService.js"
import { ObjectId } from "mongodb"
import { setUserCookie } from "../utils/cookieUtil.js"
import { createSocailUser, createUser } from "../services/authService.js"
import { githubAuth } from "../services/githubAuthService.js"
import redisClient from "../db/redisDB.js"



export const userRegister = async (req, res) => {
    const { name, email, password, trems, otp } = req.body



    const optRecord = await OTP.findOne({ email, otp }).lean()


    if (!optRecord) {
        return res.status(401).json({ error: "Invalid OTP or Exipred otp" })
    }

    await OTP.deleteOne()

    try {
        const userId = new ObjectId()
        const folderId = new ObjectId()

        await createUser(userId, folderId, name, email, password, trems)
        res.status(201).json({ success: "Account Created" })
    } catch (error) {
        next(error)
    }
}

export const userLogin = async (req, res, next) => {

    const { email, password } = req.body

    try {
        const user = await Users.findOne({ email })

        if (!user) {
            return res.status(401).json({ error: "Invaild Credentials" })
        }

        const verifyPassword = await user.comparePassword(password)

        if (!verifyPassword) {
            return res.status(401).json({ error: "Invaild Credentials" })
        }

        await setUserCookie(res, user._id)
        res.status(201).json({ success: "Login Successfuly" })
    } catch (error) {
        next(error)
    }
}


export const userInfoData = (req, res) => {
    const user = req.user
    res.status(200).json({ id: user._id, name: user.name, email: user.email, picture: user.picture })
}


export const userLogout = async (req, res) => {
    res.clearcookie("sid")
    res.end()
}

export const sendVerificationCode = async (req, res) => {
    const { email } = req.body
    const user = await Users.findOne({ email })
    if (user) {
        return res.status(401).json({ error: "Email  already exists" })
    }
    const resData = await sendOtpServService(email)
    res.status(201).json(resData)
}


export const loginWithgoogleAuth = async (req, res, next) => {
    const { code } = req.body
    try {
        const { name, email, picture } = await googleAuth(code)
        const user = await Users.findOne({ email })
        if (user) {
            await setUserCookie(res, user._id)
            res.status(201).json({ success: "Login Successfuly" })
        } else {
            const userId = new ObjectId()
            const folderId = new ObjectId()
            createSocailUser(userId, folderId, name, email, picture)
            await setUserCookie(res, userId)
            res.status(201).json({ success: "Account Created" })
        }
    } catch (error) {
        res.json({ error })
    }
}

export const redirectToAuthURL = async (req, res, next) => {
    const redirectUrl = `https://github.com/login/oauth/authorize?client_id=Ov23lirRtNWXRJA0WsI5&scope=user:email`;

    res.redirect(redirectUrl);
}


export const loginWithgithubAuth = async (req, res) => {
    const { code } = req.query;
    try {
        const { name, email, picture } = await githubAuth(code)
        const user = await Users.findOne({ email })
        if (user) {
            await setUserCookie(res, user._id)
        } else {
            const userId = new ObjectId()
            const folderId = new ObjectId()
            createSocailUser(userId, folderId, name, email, picture)

            await setUserCookie(res, userId)
        }

        res.redirect(process.env.FRONTEND_URL);
    } catch (error) {
        res.redirect(`${process.env.FRONTEND_URL}/auth/error`);
    }
}

