import { initializeSocketIO } from "./socket";
import { initializeRedis } from "./redis";
import { initializeGrpc } from "./grpc";
import initializeCronJobs from "./cronjobs";

// add more services here
const initializeServices = (httpServer) => {
  // Initialize services
  initializeSocketIO(httpServer);
  // initializeRedis();
  initializeGrpc();
  initializeCronJobs();
};

export default initializeServices;
