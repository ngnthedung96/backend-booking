import { Server } from "socket.io";

// eslint-disable-next-line import/no-mutable-exports
let socketInstance = {};
const initializeSocketIO = (httpServer) => {
  socketInstance = new Server(httpServer, {
    cors: {
      origin: ["http://localhost:8080", "https://localhost:8080"],
    },
  });

  socketInstance.on("connection", (socket) => {
    console.log("socket connected: ", socket.id);
    socket.on("disconnect", () => {
      console.log("A user disconnected", socket.id);
      // Perform any necessary cleanup or additional logic here
    });
  });

  console.log("\x1b[32m%s\x1b[0m", "Socketio initialized success!");
};

export { initializeSocketIO, socketInstance };
