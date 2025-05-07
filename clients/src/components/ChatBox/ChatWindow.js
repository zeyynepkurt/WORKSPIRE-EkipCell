import { useEffect, useState, useRef } from "react";
import { useOutletContext } from "react-router-dom";
import socket from "../../socket";
import MessageBubble from "./MessageBubble";

const ChatWindow = ({ recipient, isGroup, language }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef();
  const { darkMode } = useOutletContext();

  const username = localStorage.getItem("userEmail");
  const department = localStorage.getItem("userDepartment");

  const translations = {
    tr: {
      teamChat: "💬 Ekip Sohbeti",
      loading: "Yükleniyor...",
      noMessages: "Henüz mesaj yok.",
      placeholder: "Mesaj yaz...",
      send: "Gönder",
    },
    en: {
      teamChat: "💬 Team Chat",
      loading: "Loading...",
      noMessages: "No messages yet.",
      placeholder: "Type a message...",
      send: "Send",
    },
  };

  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      try {
        const url = isGroup
          ? `http://localhost:5000/api/messages/group?department=${department}`
          : `http://localhost:5000/api/messages/private?user1=${username}&user2=${recipient.email}`;
        const res = await fetch(url);
        const data = await res.json();
        setMessages(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Mesajlar alınamadı:", error);
        setMessages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [recipient, isGroup]);

  useEffect(() => {
    const handleIncoming = (msg) => {
      if (isGroup) {
        if (!msg.is_private && msg.department === department) {
          setMessages((prev) => [...prev, msg]);
        }
      } else if (recipient) {
        const isMine = msg.username === username && msg.recipient_email === recipient.email;
        const isFromThem = msg.username === recipient.email && msg.recipient_email === username;
        if (msg.is_private && (isMine || isFromThem)) {
          setMessages((prev) => [...prev, msg]);
        }
      }
    };

    socket.on("receiveMessage", handleIncoming);
    return () => socket.off("receiveMessage", handleIncoming);
  }, [recipient, isGroup]);

  const sendMessage = () => {
    if (input.trim()) {
      socket.emit("sendMessage", {
        username,
        content: input,
        department,
        is_private: !isGroup,
        recipient_email: isGroup ? "" : recipient.email,
      });
      setInput("");
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const title = isGroup
    ? translations[language].teamChat
    : `${recipient.name} (${recipient.email})`;

  return (
    <div className="h-full flex flex-col">
      <div className={'p-4 border-b font-semibold text-lg ${darkMode ? "bg-[#1e293b] text-white" : "bg-gray-100 text-black"}'}>{title}</div>

      <div className={`flex-1 p-4 overflow-y-auto ${darkMode ? "bg-[#1e293b] text-white" : "bg-gray-100 text-black"} space-y-2`}>
        {loading ? (
          <div className="text-center text-gray-500">{translations[language].loading}</div>
        ) : messages.length === 0 ? (
          <div className="text-center text-gray-400 italic">{translations[language].noMessages}</div>
        ) : (
          messages.map((msg, i) => (
            <MessageBubble key={i} message={msg} isOwn={msg.username === username} />
          ))
        )}
        <div ref={bottomRef} />
      </div>

      <div className={`p-4 border-t ${darkMode ? "bg-[#1e293b]" : "bg-white"} flex gap-2`}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={translations[language].placeholder}
          className="flex-1 p-2 rounded border"
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {translations[language].send}
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
