// components/ChatPage.js
import ChatContainer from "./ChatBox/ChatContainer";

const ChatPage = () => {
  return (
    <div className={`flex-1 ${darkMode ? "bg-[#0f172a] text-white" : "bg-gray-50 text-gray-900"} relative`}>
      <h2 className="text-xl font-bold mb-4">💬 Mesajlaşma</h2>
      <ChatContainer />
    </div>
  );
};

export default ChatPage;
