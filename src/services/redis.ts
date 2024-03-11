import { createClient } from "redis";

export let redisClient: any;

export const initRedis = async () => {
  redisClient = await createClient()
    .on("error", (err) => console.log("Redis Client Error", err))
    .connect();
};
