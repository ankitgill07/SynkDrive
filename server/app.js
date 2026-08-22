import "dotenv/config";
import express from "express";
import authRouter from "./routers/authRouter.js";
import folderRouter from "./routers/folderRouter.js";
import fileRouter from "./routers/fileRouter.js";
import photoRouter from "./routers/photoRouter.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { checkAuth } from "./middlewares/authMiddleware.js";
import recycleBinRouter from "./routers/recycleBinRouter.js";
import starredRouter from "./routers/starredRouter.js";
import shareRoutter from "./routers/shareRouter.js";
import userRouter from "./routers/userRouter.js";
import { StatusCodes } from "http-status-codes";
import { successResponse } from "./utils/apiResponse.js";
import { errorHandler } from "./middlewares/errorHandle.js";
import subscriptionRouter from "./routers/subscriptionRouter.js";
import webhookRouter from "./routers/webhookRouter.js";
import helmet from "helmet";
import { eventController } from "./controllers/eventController.js";
import { getShareWithLink } from "./controllers/shareContoller.js";
import { Limiter } from "./utils/RateLimiter.js";
import adminRouter from "./routers/adminRouter.js";
import connetDB from "./db/db.js";

await connetDB();
const app = express();



app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use("/uploads", express.static("uploads"));

const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS blocked: ${origin}`));
      }
    },
    credentials: true,
  }),
);



app.use("/auth", authRouter);

app.use("/user", checkAuth, userRouter);

app.use("/admin", adminRouter);

app.use("/folder", checkAuth, folderRouter);

app.use("/file", checkAuth, fileRouter);

app.get(
  "/share/public/file/:fileId",
  Limiter.filePublicAccess(),
  getShareWithLink,
);

app.use("/share", checkAuth, shareRoutter);

app.use("/recycle-bin", checkAuth, recycleBinRouter);

app.use("/photos", checkAuth, photoRouter);

app.use("/starred", checkAuth, starredRouter);

app.use("/subscription", checkAuth, subscriptionRouter);

app.use("/webhook", webhookRouter);
app.use("/events", eventController);

app.get("/", (req, res) => {
  return successResponse(
    res,
    StatusCodes.OK,
    "App working fine in production environment",
  );
});

app.use(errorHandler);

app.listen(4000 , () => {
  console.log("server start prot 4000");
  
})
export default app