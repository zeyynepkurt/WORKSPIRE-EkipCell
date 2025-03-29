// components/ChatBox/ChatWindow.js

const ChatWindow = ({ messages, selectedUser, sendMessage, message, setMessage }) => {
    return (
      <div style={{ width: "70%", padding: "0.5rem" }}>
        <h4>
          {selectedUser === "group" ? "📢 Grup Sohbeti" : `👤 ${selectedUser} ile Sohbet`}
        </h4>
  
        <div
          style={{
            height: "300px",
            overflowY: "auto",
            border: "1px solid #ccc",
            padding: "0.5rem",
            marginBottom: "1rem",
            backgroundColor: "#f9f9f9",
          }}
        >
          {messages.map((msg, i) => (
            <div key={i} style={{ marginBottom: "0.5rem" }}>
              <strong>{msg.username}</strong>: {msg.content}
            </div>
          ))}
        </div>
  
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Mesaj yaz..."
          style={{ width: "80%", marginRight: "0.5rem", padding: "0.5rem" }}
        />
        <button onClick={sendMessage}>Gönder</button>
      </div>
    );
  };
  
  export default ChatWindow;
  