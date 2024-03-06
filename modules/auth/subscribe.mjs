import redisClient from "../redis.mjs";

const subscriber = redisClient.duplicate();
subscriber.on("error", (err) => console.error(err));
subscriber.on("connect", (err) => console.log("subscribe is connect"));
await subscriber.connect();
const listener = (message, channel) => {
  // process subscribe
  console.log(message, channel);
};
await subscriber.subscribe("auth-channel", listener);

export default subscriber;
