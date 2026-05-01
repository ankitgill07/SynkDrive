import { createClient } from "redis";

const redisClient = createClient({
  username: "default",
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,  
    port: parseInt(process.env.REDIS_PORT) || 13993,
    reconnectStrategy: (retries) => {
      if (retries > 5) {
        console.error("Redis error: Max retries reached");
        return new Error("Max retries reached");
      }
      console.log(`Redis: retrying connection in ${retries * 500}ms (attempt ${retries})`);
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
