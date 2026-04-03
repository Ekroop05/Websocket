const { Server } = require("socket.io");
const { handleMessage } = require("../controllers/socketController");
const User = require("../models/User");
const { log } = require("../utils/logger");

let io;

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", async (socket) => {
    try {
      await User.create({ socketId: socket.id });

      log(`🟢 User connected: ${socket.id}`);

      socket.on("message", (data) => {
        handleMessage(io, socket, data);
      });

      socket.on("disconnect", async () => {
        await User.deleteOne({ socketId: socket.id });
        log(`🔴 User disconnected: ${socket.id}`);
      });
    } catch (err) {
      console.error(err);
    }
  });
};

module.exports = { initSocket };