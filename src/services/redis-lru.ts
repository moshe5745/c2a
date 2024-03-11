import { LRUCache } from "lru-cache";

const options = {
  max: 10,
  maxSize: 10,
};

export const lruCache = new LRUCache(options);
