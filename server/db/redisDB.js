import { createClient } from "redis";

const redisClient = createClient({
  username: "default",
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_DB_URL,
    port: 13993,
  },
});

redisClient.on("error", (err) => {
  console.log("Redis Client Errors", err);
  process.exit(1);
});



export default redisClient;
