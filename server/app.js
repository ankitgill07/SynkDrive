import "dotenv/config";
import express from "express";
import authRouter from "./routers/authRouter.js";
import folderRouter from "./routers/folderRouter.js";
import fileRouter from "./routers/fileRouter.js";
import photoRouter from "./routers/photoRouter.js";
import connetDB from "./db/db.js";
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
import { startCronJob } from "./cron/index.js";

const app = express();

const PORT = process.env.PORT || 4000;

await connetDB();

startCronJob();

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

app.post("/github-webhook", (req, res) => {
  const getWebhookSignature = req.headers["x-hub-signature-256"];
  if (!getWebhookSignature) {
    return res.status(403).json({ error: "Signature not received" });
  }

  const calculateWebhookSignature =
    "sha256=" +
    crypto
      .createHmac("sha256", "ankit@123")
      .update(JSON.stringify(req.body))
      .digest("hex");

  if (getWebhookSignature !== calculateWebhookSignature) {
    return res.status(403).json({ error: "Invalid Signature" });
  }
  res.json({ message: "Ok" });
  const commits = req.body.commits || [];

  const changedFiles = commits.flatMap((commit) => [
    ...commit.added,
    ...commit.modified,
    ...commit.removed,
  ]);

  const clientChanged = changedFiles.some((file) => file.startsWith("client/"));
  const serverChanged = changedFiles.some((file) => file.startsWith("server/"));

  if (!clientChanged && !serverChanged) {
    return res.json({ message: "No relevant changes, skipping deploy" });
  }

  function runScript(script) {
    console.log(`Running: ${script}`);
    const proc = spawn("bash", [script]);

    proc.stdout.on("data", (data) => process.stdout.write(data));
    proc.stderr.on("data", (data) => process.stderr.write(data));

    proc.on("close", (code) => {
      if (code === 0) {
        console.log(`✅ ${script} completed successfully`);
      } else {
        console.log(`❌ ${script} failed with code ${code}`);
      }
    });

    proc.on("error", (err) => {
      console.error(`Error spawning ${script}:`, err);
    });
  }

  if (clientChanged) runScript("/home/ubuntu/deploy-client.sh");
  if (serverChanged) runScript("/home/ubuntu/deploy-server.sh");
});

app.use("/auth", authRouter);

app.use("/user", checkAuth, userRouter);

app.use("/folder", checkAuth, folderRouter);

app.use("/file", checkAuth, fileRouter);

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

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
