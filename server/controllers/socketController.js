const Message = require("../models/Message");
const { error, log } = require("../utils/logger");

const handleMessage = async (io, socket, data) => {
  try {
    // 🧠 VALIDATION (IMPORTANT)
    if (!data || !data.text || !data.user) {
      throw new Error("Invalid message format");
    }

    const newMessage = await Message.create({
      user: data.user,
      text: data.text,
    });

    log(`📩 Message saved from ${data.user}`);

    io.emit("message", newMessage);

  } catch (err) {
    error(`Error saving message: ${err.message}`);
  }
};

module.exports = { handleMessage };