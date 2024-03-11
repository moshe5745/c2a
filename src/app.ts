import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";

import config from "./config";
import errorHandler from "./middleware/errorHandler";
import fourOhFour from "./middleware/fourOhFour";
import redisMiddleware from "./middleware/cacheMiddleware";
import getWeather from "./services/weather";
import { initRedis } from "./services/redis";
import { lruCache } from "./services/redis-lru";

const app = express();

initRedis();

// Apply most middleware first
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    // @ts-ignore no-implicit-any
    origin: config.clientCorsOrigins[config.nodeEnv] ?? "*",
  })
);

app.use(helmet());
app.use(morgan("tiny"));

// Apply routes before error handling

app.use("/health", (req, res) => res.sendStatus(200));
app.get("/", redisMiddleware, async (req, res, next) => {
  const citiesQuery = req.query.city as string;
  if (!citiesQuery) {
    return res.status(400).send("No city provided");
  }

  const cities = citiesQuery.split(",");

  const weather = await getWeather(cities[0]);

  return res.send(weather);
});
app.get("/latest", (req, res) => {
  return lruCache.dump();
});

// Apply error handling last
app.use(fourOhFour);
app.use(errorHandler);

export default app;
