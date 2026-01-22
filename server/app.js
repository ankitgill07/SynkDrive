import "dotenv/config"
import express from "express"
import authRouter from "./routers/authRouter.js"
import folderRouter from './routers/folderRouter.js'
import fileRouter from "./routers/fileRouter.js"
import { connetDB } from "./db/db.js"
import cookieParser from "cookie-parser"
import cors from "cors"
import { checkAuth } from "./middlewares/authMiddleware.js"




const app = express()

await connetDB()

app.use(express.json())
app.use(cookieParser(process.env.COOKIE_SECRET))



app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

app.use("/uploads", express.static("uploads"))


app.use("/auth", authRouter)

app.use("/folder", checkAuth, folderRouter)

app.use("/file", checkAuth, fileRouter)

app.use((req, res) => {
    res.status(501).json({ error: "somthinh went worng" })
})


const PORT = process.env.PORT || 4000

app.listen(PORT, () => {
    console.log("server start at http://localhost:4000");

})