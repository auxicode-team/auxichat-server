import * as session from "express-session";
import * as Redis from "ioredis";
import * as connectRedis from "connect-redis";

const client = new Redis(
  parseInt(process.env.REDIS_PORT!),
  process.env.REDIS_HOSTNAME,
  { password: process.env.REDIS_PASSWORD },
);
client.on("connect", () => {
  console.log("Connected to Redis!");
});
client.on("error", console.error);
const RedisStore = connectRedis(session);

export const redisStore = new RedisStore({ client } as any);
