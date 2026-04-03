import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import "./App.css";

const socket = io("http://localhost:5000");

function App() {
  const [username, setUsername] = useState("");
  const [joined, setJoined] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (!joined) return;

    socket.emit("join", username);

    socket.on("loadMessages", (msgs) => {
      setMessages(msgs);
    });

    socket.on("message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

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

    socket.emit("message", {
      user: username,
      text: message,
    });

    setMessage("");
  };

  // 🔥 JOIN SCREEN
  if (!joined) {
    return (
      <div className="join-screen">
        <h2>Enter your name</h2>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Your name..."
        />
        <button onClick={() => username && setJoined(true)}>
          Join Chat
        </button>
      </div>
    );
  }

  return (
    <div className="app">
      {/* SIDEBAR */}
      <div className="sidebar">
        <h3>💬 Chat</h3>
        <p className="username">You: {username}</p>

        <div className="users">
          <h4>Online</h4>
          <p>Coming soon...</p>
        </div>
      </div>

      {/* CHAT AREA */}
      <div className="chat-container">
        <div className="chat-header">
          <h3>General Chat</h3>
        </div>

        <div className="chat-box">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`message ${
                msg.user === username ? "own" : ""
              }`}
            >
              <span className="user">{msg.user}</span>
              <p>{msg.text}</p>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        <div className="input-box">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type message..."
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default App;