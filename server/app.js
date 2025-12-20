import express from "express"
import authRouter from "./routers/authRouter.js"
import { connetDB } from "./db/db.js"
import cookieParser from "cookie-parser"
import dotenv from "dotenv"


dotenv.config({quiet : true});

const app = express()

await connetDB()

app.use(express.json())
app.use(cookieParser())



app.use("/auth", authRouter)

app.use((req, res) => {
    res.status(501).json({ error: "somthing is wrong" })
})



app.listen(process.env.PORT, () => {
    console.log("server start at http://localhost:4000");

})