import Sessions from "../models/sessionModel.js"
import Users from "../models/userModel.js"
import bcrypt from "bcrypt"

export const userRegister = async (req, res) => {
    const { name, email, password } = req.body
    try {
        const hashPassword = await bcrypt.hash(password, 12)
        const user = new Users({
            name,
            email,
            password: hashPassword,
        })
        await user.save()
        res.status(201).json({ success: "Account Created" })
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                error: "Email  already exists"
            })
        } else {
            res.status(501).json({ error: "somthing is wrong" })
        }
    }
}

export const userLogin = async (req, res, next) => {
    const { email, password } = req.body

    try {
        const user = await Users.find({ email })
        if (!user) {
            return res.status(401).json({ error: "Invaild credentials" })
        }
        const verifyPassword = bcrypt.compare(password, user.password)
        if (!verifyPassword) {
            return res.status(401).json({ error: "Invaild credentials" })
        }

        const session = await Sessions.create({ userId: user._id })

        res.cookie("sid", session.id, {
            httpOnly: true,
            signed: true,
            maxAge: 1000 * 60 * 60 * 24 * 7
        })
        res.status(201).json({ success: "Login Successfuly" })
    } catch (error) {
        next(error)
    }
}


export const userInfoData = async (req, res) => {
    const user = req.user
    res.status(200).json({ name: user.name, email: user.email })
}


export const userLogout = async (req, res) => {
    res.clearcookie("sid")
    res.end()
} 