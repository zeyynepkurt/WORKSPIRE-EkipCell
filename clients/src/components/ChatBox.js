import React, { useEffect, useState } from "react";
import socket from "../socket";

const ChatBox = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const username = localStorage.getItem("userEmail") || "Bilinmeyen";
  const department = localStorage.getItem("userDepartment") || "Genel";
  const [recipientEmail, setRecipientEmail] = useState("");

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/messages");
        const data = await res.json();
        setMessages(data); // mesajları yükle
      } catch (err) {
        console.error("Eski mesajlar alınamadı:", err);
      }
    };
  
    fetchMessages();

    const handleMessage = (data) => {
      setMessages((prev) => [...prev, data]);
    };
  
    socket.on("receiveMessage", handleMessage);
  
    return () => {
      socket.off("receiveMessage", handleMessage); // sadece mesaj listener'ını kaldır
    };
  }, []);

  const sendMessage = () => {
    if (message.trim()) {
      const isPrivate = recipientEmail.trim() !== "";
  
      socket.emit("sendMessage", {
        username,
        content: message,
        department,
        recipient_email: recipientEmail.trim(),
        is_private: isPrivate,
      });
  
      setMessage("");
    }
  };
  
  

  return (
    <div style={{ border: "1px solid gray", padding: "1rem", borderRadius: "10px" }}>
      <h3>💬 Ekip İçi Chat</h3>
      <div style={{ height: "150px", overflowY: "scroll", marginBottom: "1rem" }}>
      {messages
        .filter((msg) => {
          if (msg.is_private) {
            // bireysel mesaj: ya ben göndericiyim ya da ben alıcıyım
            return (
              msg.username === username ||
              msg.recipient_email === username
            );
          } else {
            // grup mesaj: sadece departman eşleşirse
            return msg.department === department;
          }
        })
        .map((msg, i) => (
          <div key={i}>
            <strong>{msg.username}</strong> [{new Date(msg.timestamp).toLocaleTimeString()}]: {msg.content}
          </div>
      ))}

      </div>
      <input
        value={recipientEmail}
        onChange={(e) => setRecipientEmail(e.target.value)}
        placeholder="Kime? (e-posta)"
        style={{ width: "100%", marginBottom: "0.5rem", padding: "0.5rem", borderRadius: "5px" }}
      />

      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Mesaj yaz..."
      />
      <button onClick={sendMessage}>Gönder</button>
    </div>
  );
};

export default ChatBox;
