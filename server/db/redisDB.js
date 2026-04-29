import { createClient } from "redis"

const redisClient = createClient({
    url :  process.env.REDIS_DB_URL
});

redisClient.on("error", (err) => {
    console.log("Redis Client Error", err);
    process.exit(1);
});

await redisClient.connect();

export default redisClient;