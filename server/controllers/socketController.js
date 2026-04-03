const { log, error } = require("../utils/logger");
const Message = require("../models/Message");

const handleMessage = async (io, socket, data) => {
  try {
    const newMessage = await Message.create({
      user: socket.id,
      text: data,
    });

    log(`📩 Saved message from ${socket.id}`);

    io.emit("message", newMessage);
  } catch (err) {
    error("Error saving message");
  }
};

module.exports = { handleMessage };