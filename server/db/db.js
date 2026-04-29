import mongoose from "mongoose";

export default async function connetDB() {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log("MongoDB connected successfully ✅");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
}

process.on("SIGTERM", async () => {
  await mongoose.disconnect();
  console.log("MongoDB disconnected gracefully");
  process.exit(0);
});