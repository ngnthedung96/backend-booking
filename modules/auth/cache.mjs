import redisClient from '../../boot/redis';

const cacheData = async (req, res, next) => {
  let results;
  try {
    const cacheResults = await redisClient.get('user');
    if (cacheResults) {
      results = JSON.parse(cacheResults);
      res.locals.isCache = true;
      res.locals.cacheData = results;
    }
    next();
  } catch (error) {
    next(error);
  }
};

export default cacheData;
