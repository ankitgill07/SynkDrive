import { createClient } from "redis";

const redisClient = createClient({
  username: "default",
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_DB_URL,
    port: 13993,
    reconnectStrategy: (retries) => {
      if (retries > 5) {
        console.error("Redis: max retries reached, giving up");
        return new Error("Max retries reached");
      }
      const delay = Math.min(retries * 500, 3000); // wait up to 3s between retries
      console.log(`Redis: retrying connection in ${delay}ms (attempt ${retries})`);
      return delay;
    },
  },
});

redisClient.on("error", (err) => {
  console.error("Redis Client Error:", err.message); // log but DON'T exit
});

redisClient.on("connect", () => console.log("Redis connected ✓"));
redisClient.on("reconnecting", () => console.log("Redis reconnecting..."));

// Connect lazily via a function instead of top-level await
let isConnected = false;

export async function connectRedis() {
  if (!isConnected) {
    await redisClient.connect();
    isConnected = true;
  }
}

export default redisClient;
