import "dotenv/config";
import http from "node:http";
import fs from "fs";
import express from "express";
import serverless from "serverless-http";
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
import { runCronTasks, startCronJob } from "./cron/index.js";
import { Limiter } from "./utils/RateLimiter.js";
import adminRouter from "./routers/adminRouter.js";
import connetDB, { connectDBMiddleware } from "./db/db.js";


const app = express();

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3000",
  "https://synkdrive.in",
  "https://www.synkdrive.in",
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

// Health check — no DB needed
app.get("/", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "SynkDrive API working",
  });
});

// ─── DB Connection Middleware ─────────────────────────────────────────────────
// Applied GLOBALLY to all routes below. This guarantees MongoDB is connected
// before ANY route handler runs — works in both server and serverless/Worker mode.
app.use(connectDBMiddleware);

// Routes
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

// 404
app.use((req, res) => {
  return res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.originalUrl,
  });
});

// Error handler
app.use(errorHandler);


// Start the server (only in non-worker/non-serverless mode)
// In worker.js (Cloudflare), the app is imported and used differently.
if (!process.env.CLOUDFLARE_WORKER) {
  connetDB()
    .then(() => {
      startCronJob();
      app.listen(4000, () => {
        console.log("Server started on port 4000");
      });
    })
    .catch((error) => {
      console.error("Failed to start server:", error.message);
      process.exit(1);
    });
}

export default app;
