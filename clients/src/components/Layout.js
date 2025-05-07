import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import socket from "../socket"; // socket.js dosyanın yolu buysa


const Layout = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("tr");
  const [menuOpen, setMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    socket.on("receiveMessage", (msg) => {
      const currentEmail = localStorage.getItem("userEmail");
      const isMine = msg.username === currentEmail;
      const isToMe = msg.recipient_email === currentEmail;
  
      if (!isMine && (msg.department === localStorage.getItem("userDepartment") || isToMe)) {
        setUnreadCount((prev) => prev + 1);
      }
    });
  
    return () => socket.off("receiveMessage");
  }, []);
  

  return (
    <div className={`${darkMode ? "bg-[#0f172a] text-white" : "bg-white text-gray-900"} min-h-screen transition-colors duration-300`}>
      {/* Navbar */}
      <Navbar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        language={language}
        setLanguage={setLanguage}
        setMenuOpen={setMenuOpen}
        unreadCount={unreadCount}
      />

      <div className="flex">
        {/* Sidebar */}
        <div
          className={`fixed top-0 left-0 h-full w-64 bg-blue-900 text-white transform ${
            menuOpen ? "translate-x-0" : "-translate-x-full"
          } transition-transform duration-300 shadow-lg z-50`}
        >
          <button
            className="absolute top-4 right-4 text-white text-2xl"
            onClick={() => setMenuOpen(false)}
          >
            ×
          </button>
          <Sidebar
            menuOpen={menuOpen}
            setMenuOpen={setMenuOpen}
            darkMode={darkMode}
            language={language}
          />
        </div>

        {/* Sayfa içeriği */}
        <main className="w-full pt-16 px-4 md:px-8 lg:px-16">
            <Outlet context={{ darkMode, language }} />
        </main>


      </div>
    </div>
  );
};

export default Layout;
