require("dotenv").config();
const http = require("http");
const app = require("./app");
const { initSocket } = require("./sockets/socket");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

// ✅ CONNECT DATABASE HERE
connectDB();

// Initialize socket
initSocket(server);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});