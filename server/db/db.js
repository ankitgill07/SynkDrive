import mongoose from "mongoose";

let connectPromise = null;

export default async function connetDB() {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  if (!process.env.DATABASE_URL) {
    console.warn("DATABASE_URL is not set in environment variables.");
    return;
  }

  if (!connectPromise) {
    connectPromise = mongoose
      .connect(process.env.DATABASE_URL)
      .catch((error) => {
        console.error("MongoDB connection failed:", error.message);
        throw error;
      })
      .finally(() => {
        connectPromise = null;
      });
  }

  return await connectPromise;
}


if (typeof process !== "undefined" && typeof process.on === "function") {
  process.on("SIGTERM", async () => {
    try {
      await mongoose.disconnect();
    } catch {
      // ignore
    }
  });
}