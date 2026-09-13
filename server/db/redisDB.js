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
      return retries * 500;
    },
  },
});

redisClient.on("error", (err) => {
  console.error("Redis Client Error:", err.message);
});

try {
  await redisClient.connect();
} catch (err) {
  console.error("Redis failed to connect:", err.message);
  process.exit(1);
}

export default redisClient;
