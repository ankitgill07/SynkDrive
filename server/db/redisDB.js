import { createClient } from "redis";

let client = null;
let connectPromise = null;

async function getClient() {
  if (!client) {
    const redisUrl = process.env.REDIS_DB_URL || process.env.UPSTASH_REDIS_URL;
    client = createClient({
      url: redisUrl,
      socket: {
        tls: (redisUrl || "").startsWith("rediss://"),
        reconnectStrategy: (retries) => {
          if (retries > 5) {
            console.error("Redis error: Max retries reached");
            return new Error("Max retries reached");
          }
          return retries * 500;
        },
      },
    });

    client.on("error", (err) => {
      console.error("Redis Client Error:", err.message);
    });
  }

  if (!client.isOpen) {
    if (!connectPromise) {
      connectPromise = client
        .connect()
        .catch((err) => {
          console.error("Redis failed to connect:", err.message);
          throw err;
        })
        .finally(() => {
          connectPromise = null;
        });
    }
    await connectPromise;
  }

  return client;
}

const redisClient = new Proxy(
  {},
  {
    get(target, prop) {
      if (prop === "then") return undefined;

      // Handle namespaces like redisClient.ft and redisClient.json
      if (prop === "ft" || prop === "json") {
        return new Proxy(
          {},
          {
            get(nsTarget, nsProp) {
              if (nsProp === "then") return undefined;
              return async (...args) => {
                const actualClient = await getClient();
                const namespace = actualClient[prop];
                const method = namespace?.[nsProp];
                if (typeof method === "function") {
                  return method.apply(namespace, args);
                }
                return method;
              };
            },
          },
        );
      }

      // Handle direct methods on client (del, expire, scan, get, set, etc.)
      return async (...args) => {
        const actualClient = await getClient();
        const method = actualClient[prop];
        if (typeof method === "function") {
          return method.apply(actualClient, args);
        }
        return method;
      };
    },
  },
);

export default redisClient;
export { getClient };