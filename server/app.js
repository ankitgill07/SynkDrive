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
import connetDB from "./db/db.js";

// Polyfill assignSocket for Cloudflare Workers unenv node:http compatibility
if (http.ServerResponse && !http.ServerResponse.prototype.assignSocket) {
  http.ServerResponse.prototype.assignSocket = function (socket) {
    this.socket = socket;
    this.connection = socket;
  };
} else if (http.ServerResponse) {
  const originalAssignSocket = http.ServerResponse.prototype.assignSocket;
  http.ServerResponse.prototype.assignSocket = function (socket) {
    try {
      originalAssignSocket.call(this, socket);
    } catch {
      this.socket = socket;
      this.connection = socket;
    }
  };
}

const app = express();

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));

if (fs.existsSync("uploads")) {
  app.use("/uploads", express.static("uploads"));
}

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3000",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
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

app.use((req, res) => {
  return res.status(StatusCodes.NOT_FOUND).json({ error: "Route not found" });
});

app.use(errorHandler);

const serverlessHandler = serverless(app);

const isCloudflareWorker =
  typeof WebSocketPair !== "undefined" ||
  Boolean(process.env.CLOUDFLARE_WORKER) ||
  Boolean(process.env.WORKERS) ||
  Boolean(process.env.CF_PAGES);

// Cloudflare Workers entrypoint
export default {
  async fetch(request, env, ctx) {
    if (env && typeof env === "object") {
      for (const [key, value] of Object.entries(env)) {
        if (typeof value === "string") {
          process.env[key] = value;
        }
      }
    }

    await connetDB();

    const url = new URL(request.url);
    const headers = {};
    const multiValueHeaders = {};
    for (const [k, v] of request.headers.entries()) {
      const lower = k.toLowerCase();
      headers[lower] = v;
      multiValueHeaders[lower] = [v];
    }

    const queryStringParameters = {};
    const multiValueQueryStringParameters = {};
    for (const [k, v] of url.searchParams.entries()) {
      queryStringParameters[k] = v;
      if (!multiValueQueryStringParameters[k]) {
        multiValueQueryStringParameters[k] = [];
      }
      multiValueQueryStringParameters[k].push(v);
    }

    let body = null;
    let isBase64Encoded = false;
    if (request.method !== "GET" && request.method !== "HEAD") {
      const arrayBuffer = await request.arrayBuffer();
      if (arrayBuffer.byteLength > 0) {
        body = Buffer.from(arrayBuffer).toString("base64");
        isBase64Encoded = true;
      }
    }

    const event = {
      httpMethod: request.method,
      path: url.pathname,
      headers,
      multiValueHeaders,
      queryStringParameters,
      multiValueQueryStringParameters,
      body,
      isBase64Encoded,
      requestContext: {
        http: {
          method: request.method,
          path: url.pathname,
        },
      },
    };

    const response = await serverlessHandler(event, ctx || {});
    console.log("Serverless response:", JSON.stringify(response));



    const respHeaders = new Headers();
    if (response.multiValueHeaders) {
      for (const [k, values] of Object.entries(response.multiValueHeaders)) {
        for (const val of values) {
          respHeaders.append(k, val);
        }
      }
    } else if (response.headers) {
      for (const [k, v] of Object.entries(response.headers)) {
        if (Array.isArray(v)) {
          v.forEach((val) => respHeaders.append(k, val));
        } else if (v !== undefined) {
          respHeaders.set(k, String(v));
        }
      }
    }

    const respBody = response.isBase64Encoded
      ? Buffer.from(response.body, "base64")
      : response.body;

    return new Response(respBody, {
      status: response.statusCode,
      headers: respHeaders,
    });
  },

  async scheduled(event, env, ctx) {
    if (env && typeof env === "object") {
      for (const [key, value] of Object.entries(env)) {
        if (typeof value === "string") {
          process.env[key] = value;
        }
      }
    }
    await connetDB();
    await runCronTasks();
  },
};

export { app };

const isStandaloneNode =
  !isCloudflareWorker &&
  !process.env.AWS_LAMBDA_FUNCTION_NAME &&
  process.env.NODE_ENV !== "test";

if (isStandaloneNode) {
  await connetDB();
  startCronJob();
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}