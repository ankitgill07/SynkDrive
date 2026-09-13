import mongoose from "mongoose";

export default async function connetDB() {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
}

process.on("SIGTERM", async () => {
  await mongoose.disconnect();
  process.exit(0);
});