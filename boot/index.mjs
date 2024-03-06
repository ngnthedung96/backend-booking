import { initializeSocketIO } from "./socket";
import { initializeRedis } from "./redis";
import initializeCronJobs from "./cronjobs";

// add more services here
const initializeServices = (httpServer) => {
  // ************Initialize services*********************
  initializeSocketIO(httpServer);
  // initializeRedis();
  initializeCronJobs();
};

export default initializeServices;
