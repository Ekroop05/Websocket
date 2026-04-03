import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import "./App.css";

const socket = io("http://localhost:5000");

function App() {
  const [username, setUsername] = useState("");
  const [joined, setJoined] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (!joined) return;

    socket.emit("join", username);

    socket.on("loadMessages", (msgs) => setMessages(msgs));
    socket.on("message", (msg) =>
      setMessages((prev) => [...prev, msg])
    );

    return () => {
      socket.off("loadMessages");
      socket.off("message");
    };
  }, [joined]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!message.trim()) return;

    socket.emit("message", { user: username, text: message });
    setMessage("");
  };

  if (!joined) {
    return (
      <div className="join-screen">
        <div className="join-card">
          <h2>Join Chat</h2>
          <input
            placeholder="Enter username..."
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button onClick={() => username && setJoined(true)}>
            Continue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className={`sidebar ${isSidebarOpen ? "" : "closed"}`}>
        <h2>💬 Chat</h2>
        <p className="me">👤 {username}</p>
      </div>

      <div className="chat">
        <div className="chat-header">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            ☰
          </button>
          <h3>General</h3>
        </div>

        <div className="messages">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`bubble ${
                msg.user === username ? "own" : ""
              }`}
            >
              <span>{msg.user}</span>
              <p>{msg.text}</p>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        <div className="input">
          <input
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button onClick={sendMessage}>➤</button>
        </div>
      </div>
    </div>
  );
}

export default App;