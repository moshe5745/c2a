import { RequestHandler } from "express";
import { redisClient } from "../services/redis";
import { lruCache } from "../services/redis-lru";

const redisHandler: RequestHandler = async (req, res, next) => {
  const url = req.url;

  // lruCache.set(url, req.body);

  const cacheEntery = await redisClient.get(url);

  if (cacheEntery) {
    return res.send(JSON.parse(cacheEntery));
  }

  await redisClient.set(url, JSON.stringify(req.body), "EX", 60);

  next();
};

export default redisHandler;
