import { createClient } from "redis"

const redisClient = createClient({
    password : 'ankit@123'
});

redisClient.on("error", (err) => {
    console.log("Redis Client Error", err);
    process.exit(1);
});

await redisClient.connect();

export default redisClient;