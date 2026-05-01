import { createClient } from "redis";

const redisClient = createClient({
  url: process.env.REDIS_URL,
  socket: {
    reconnectStrategy: (retries) => {
      if (retries > 5) return new Error("Max retries reached");
      return retries * 500;
    }
  }
});

redisClient.on("connect", () => {
  console.log("Redis connected successfully");
});

redisClient.on("reconnecting", () => {
  console.log("Redis reconnecting...");
});

try {
  await redisClient.connect();
} catch (err) {
  console.error("Redis failed to connect:", err.message);
  process.exit(1);
}

export default redisClient;
