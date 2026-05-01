import { createClient } from "redis";

const redisClient = createClient({
  url: process.env.REDIS_DB_URL,
  socket: {
    tls: false,
    reconnectStrategy: (retries) => {
      if (retries > 5) {
        console.error("Redis error: Max retries reached");
        return new Error("Max retries reached");
      }
      console.log(`Redis: retrying in ${retries * 500}ms (attempt ${retries})`);
      return retries * 500;
    },
  },
});

redisClient.on("error", (err) => {
  console.error("Redis Client Error:", err.message);
});

redisClient.on("connect", () => {
  console.log("Redis connected successfully");
});

try {
  await redisClient.connect();
  console.log("Redis ready");
} catch (err) {
  console.error("Redis failed to connect:", err.message);
  process.exit(1);
}

export default redisClient;
