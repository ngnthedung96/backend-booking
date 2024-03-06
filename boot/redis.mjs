/* eslint-disable no-console */
import { createClient } from 'redis';
import * as dotenv from 'dotenv';

dotenv.config();

// eslint-disable-next-line import/no-mutable-exports
let redisClient = {};
const initializeRedis = async () => {
  redisClient = createClient({
    url: process.env.REDIS_STRING_URL,
  });

  redisClient.on('error', (error) => console.error(`Redis connect: ${error}`));
  redisClient.on('connect', () => console.log('\x1b[32m%s\x1b[0m', 'Redis initialized success!'));
  await redisClient.connect();
};

export {
  initializeRedis,
  redisClient,
};
