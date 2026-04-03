const socket = io("http://localhost:5000");

const chatDiv = document.getElementById("chat");

socket.on("connect", () => {
  console.log("✅ Connected:", socket.id);
});

// Receive message
socket.on("message", (data) => {
  const msg = document.createElement("p");
  msg.textContent = `${data.user}: ${data.text}`;
  chatDiv.appendChild(msg);
});

// Send message
function sendMessage() {
  const input = document.getElementById("msg");

  if (input.value.trim() === "") return;

  socket.emit("message", input.value);
  input.value = "";
}