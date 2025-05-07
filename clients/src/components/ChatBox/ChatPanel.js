import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import ChatWindow from "./ChatWindow";
import NewChatModal from "./NewChatModal";

const ChatPanel = () => {
  const [activeChat, setActiveChat] = useState(null);
  const [previousContacts, setPreviousContacts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const currentUserEmail = localStorage.getItem("userEmail");
  const { language, darkMode } = useOutletContext();

  const translations = {
    tr: {
      chats: "Sohbetler",
      new: "+ Yeni",
      teamChat: "💬 Ekip Sohbeti",
      empty: "Sohbete başlamak için kişi/grup seç"
    },
    en: {
      chats: "Chats",
      new: "+ New",
      teamChat: "💬 Team Chat",
      empty: "Select a user/group to start chatting"
    },
  };

  useEffect(() => {
    fetch("http://localhost:5000/api/messages")
      .then(res => res.json())
      .then(data => {
        const contacts = data
          .filter(msg =>
            msg.is_private &&
            (msg.username === currentUserEmail || msg.recipient_email === currentUserEmail)
          )
          .map(msg => (msg.username === currentUserEmail ? msg.recipient_email : msg.username));

        const uniqueEmails = [...new Set(contacts)];

        fetch("http://localhost:5000/employees")
          .then(res => res.json())
          .then(allUsers => {
            const filtered = allUsers.filter(user => uniqueEmails.includes(user.email));
            setPreviousContacts(filtered);
          });
      });
  }, []);

  const handleStartPrivateChat = (user) => {
    setActiveChat({ type: "private", user });
    setShowModal(false);
  };

  return (
    <div className={`w-full h-screen flex ${darkMode ? "bg-[#0f172a] text-white" : "bg-white text-gray-900"}`}>
      <div className={`w-1/3 min-w-[250px] max-w-[300px] ${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"} border-r overflow-y-auto p-4`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">{translations[language].chats}</h2>
          <button className="text-blue-600 font-bold text-sm underline" onClick={() => setShowModal(true)}>
            {translations[language].new}
          </button>
        </div>

        <div
          className={`p-3 mb-4 rounded-lg cursor-pointer ${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"} border border-blue-300`}
          onClick={() => setActiveChat({ type: "group" })}
        >
          {translations[language].teamChat}
        </div>

        <ul className="space-y-2">
          {previousContacts.map(user => (
            <li
              key={user.employee_id}
              className={`p-3 rounded-lg cursor-pointer hover:bg-gray-100 border ${
                activeChat?.user?.email === user.email ? "bg-blue-100 border-blue-400" : "border-gray-300"
              }`}
              onClick={() => setActiveChat({ type: "private", user })}
            >
              <div className="font-medium">{user.name}</div>
              <div className="text-sm text-gray-500">{user.email}</div>
            </li>
          ))}
        </ul>
      </div>

      <div className={`flex-1 ${darkMode ? "bg-[#0f172a] text-white" : "bg-gray-50 text-gray-900"} relative`}>
        {activeChat ? (
          <ChatWindow
            recipient={activeChat.type === "group" ? null : activeChat.user}
            isGroup={activeChat.type === "group"}
            language={language}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500 text-lg">
            {translations[language].empty}
          </div>
        )}
      </div>

      {showModal && (
        <NewChatModal
          onClose={() => setShowModal(false)}
          onStartPrivateChat={handleStartPrivateChat}
        />
      )}
    </div>
  );
};

export default ChatPanel;
