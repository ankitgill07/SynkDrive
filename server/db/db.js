import mongoose from "mongoose";

// NOTE: mongoose.set("bufferCommands", false) here has NO effect on already-registered models
// in ES module environments because all model files are evaluated BEFORE this module body runs.
// The fix is in each Schema definition: { bufferCommands: false } — see each model file.
// This line below is kept as a belt-and-suspenders for any future models.
mongoose.set("bufferCommands", false);

let connectionPromise = null;

mongoose.connection.on("disconnected", () => {
  console.warn("MongoDB disconnected. Will reconnect on the next request.");
  connectionPromise = null;
});

mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err.message);
});

export default async function connetDB() {
  // Already connected — return immediately
  if (mongoose.connection.readyState === 1) {
    return;
  }

  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set in environment variables.");
  }

  // Reuse in-flight connection promise (prevents race conditions on simultaneous requests)
  if (!connectionPromise) {
    connectionPromise = mongoose
      .connect(process.env.DATABASE_URL, {
        serverSelectionTimeoutMS: 15000,
        connectTimeoutMS: 15000,
        socketTimeoutMS: 45000,
        // Cloudflare Workers cannot retain a pool of live sockets between
        // invocations. A single on-demand connection avoids idle pool sockets.
        maxPoolSize: process.env.CLOUDFLARE_WORKER ? 1 : 10,
        minPoolSize: 0,
      })
      .then(() => {
        console.log("MongoDB connected successfully.");
      })
      .catch((error) => {
        console.error("MongoDB connection failed:", error.message);
        connectionPromise = null; // Allow retry on next call
        throw error;
      });
  }

  return await connectionPromise;
}

/**
 * Express middleware — ensures MongoDB is connected before ANY route handler runs.
 * This is the definitive fix for both server and Cloudflare Worker/serverless modes.
 */
export async function connectDBMiddleware(req, res, next) {
  try {
    await connetDB();
    next();
  } catch (error) {
    console.error("DB connection failed for request:", req.path, error.message);
    return res.status(503).json({
      success: false,
      message: "Database temporarily unavailable. Please try again in a moment.",
    });
  }
}

// Graceful shutdown
const gracefulShutdown = async (signal) => {
  console.log(`Received ${signal}. Closing MongoDB connection...`);
  try {
    await mongoose.disconnect();
    console.log("MongoDB connection closed.");
  } catch {
    // ignore
  }
  process.exit(0);
};

if (typeof process !== "undefined" && typeof process.on === "function") {
  process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
  process.on("SIGINT", () => gracefulShutdown("SIGINT"));
}
