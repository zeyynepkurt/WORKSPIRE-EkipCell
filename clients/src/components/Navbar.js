import { FaBars, FaBell, FaEnvelope, FaUserCircle, FaSearch, FaSun, FaMoon } from "react-icons/fa";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import socket from "../socket";
import ChatBox from "./ChatBox";

const Navbar = ({ darkMode, setDarkMode, language, setLanguage, setMenuOpen }) => {
  const translations = {
    tr: { search: "Ara...", logout: "Çıkış Yap" },
    en: { search: "Search...", logout: "Log Out" }
  };

  const [chatOpen, setChatOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const navigate = useNavigate();
  const currentUser = localStorage.getItem("userEmail");
  const department = localStorage.getItem("userDepartment");

  const [notifications, setNotifications] = useState([]);
const [showNotifications, setShowNotifications] = useState(false);
const [unreadNotif, setUnreadNotif] = useState(0);
const fetchNotifications = async () => {
  const employeeId = localStorage.getItem("employeeId");
  const res = await fetch(`http://localhost:5000/api/notifications/${employeeId}`);
  const data = await res.json();

  setNotifications(data);
  // count the ones that are NOT read
  setUnreadNotif(data.filter(n => !n.is_read).length);
};

useEffect(() => {
  const handleNotification = (notif) => {
    const myId = parseInt(localStorage.getItem("employeeId"), 10);
    if (notif.employee_id === myId) {
      setNotifications(prev => [notif, ...prev]);
      setUnreadNotif(prev => prev + 1);          // new unread
      setShowNotifications(true);                // optional auto-open
    }
  };

  socket.on("receiveNotification", handleNotification);
  return () => socket.off("receiveNotification", handleNotification);
}, []);

const handleBellClick = async () => {
  const next = !showNotifications;
  setShowNotifications(next);
  if (next) {
    await fetchNotifications();

    // optional “mark-as-read” in DB
    await fetch(`http://localhost:5000/api/notifications/mark-read`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ employeeId: localStorage.getItem("employeeId") })
    });

    setUnreadNotif(0);
  }
};

  // ✅ Socket üzerinden yeni mesaj geldiğinde sayacı artır
  useEffect(() => {
    const handleMessage = (msg) => {
      const isToMe = msg.recipient_email === currentUser;
      const isSameDept = msg.department === department;
      const isPrivate = msg.is_private;

      if (
        (isPrivate && isToMe) ||
        (!isPrivate && isSameDept && msg.username !== currentUser)
      ) {
        setUnreadCount((prev) => prev + 1);
      }
    };

    socket.on("receiveMessage", handleMessage);
    return () => socket.off("receiveMessage", handleMessage);
  }, [currentUser, department]);

  // Çıkış yapma fonksiyonu
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
    window.location.reload();
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  useEffect(() => {
  const handleNotification = (notif) => {
    const myId = parseInt(localStorage.getItem("employeeId"), 10);
    if (notif.employee_id === myId) {
      setNotifications(prev => [notif, ...prev]);
      setShowNotifications(true);                 // otomatik açmak istersen
    }
  };

  socket.on("receiveNotification", handleNotification);
  return () => socket.off("receiveNotification", handleNotification);
}, []);

  return (
    <nav className={`top-4 left-2 right-2 flex justify-between items-center p-4 ${darkMode ? "bg-blue-800" : "bg-blue-900"} text-white shadow-md rounded-xl relative z-40`}>
      <div className="flex items-center gap-4">
        <button onClick={() => setMenuOpen(true)} className="text-2xl">
          <FaBars />
        </button>
        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder={translations[language].search}
            className="w-full px-4 py-2 rounded-full text-black focus:outline-none shadow-md"
          />
          <FaSearch className="absolute right-3 top-3 text-gray-600" />
        </div>
      </div>

      <div className="flex items-center gap-6">
        {/* Zarf ikonu + bildirim rozeti */}
        <div className="relative">
          <FaEnvelope
            className="text-2xl cursor-pointer"
            onClick={() => {
              navigate("/messages");
              setUnreadCount(0); // ikon tıklanınca sıfırla
            }}
          />
          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-1.5 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>

        {chatOpen && (
          <div className="absolute right-4 top-16 md:right-8 z-50">
            <ChatBox />
          </div>
        )}

        <div className="relative">
      <FaBell
        className="text-2xl cursor-pointer"
        onClick={handleBellClick}
          />
          {unreadNotif > 0 && (
            <span className="absolute -top-1 -right-1 inline-block w-2 h-2 rounded-full bg-red-500"></span>
          )}

          {showNotifications && (
    <div
      className={`absolute right-0 top-8 w-64 rounded shadow-lg ${
        darkMode ? "bg-gray-800 text-white" : "bg-white text-black"
      } z-50 p-4`}
    >
      <h4 className="font-bold mb-2">Bildirimler</h4>

      {notifications.length === 0 ? (
        <p>Bildirim yok.</p>
      ) : (
        <ul className="space-y-1 text-sm">
          {notifications.map((n) => (
            <li key={n.id} className="px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
              {n.message}
            </li>
          ))}
        </ul>
      )}
    </div>
  )}
        </div>

        {/* Profil ikonu ve dropdown */}
        <div className="relative">
          <FaUserCircle
            className="text-3xl cursor-pointer"
            onClick={() => setProfileOpen(val => !val)}
          />
          {profileOpen && (
            <div className={`absolute right-0 mt-2 w-40 rounded-md shadow-lg ${darkMode ? "bg-gray-800 text-white" : "bg-white text-black"} z-50`}>
              <button
                onClick={handleLogout}
                className={`w-full text-left px-4 py-2 transition hover:${darkMode ? "bg-gray-700" : "bg-gray-100"}`}
              >
                {translations[language].logout}
              </button>
            </div>
          )}
        </div>

        <button onClick={() => setDarkMode(!darkMode)} className="text-xl">
          {darkMode ? <FaSun className="text-yellow-400" /> : <FaMoon className="text-yellow-500" />}
        </button>

        <div className="flex gap-2">
          <button
            className={`px-3 py-1 rounded-lg text-sm ${language === "tr" ? "bg-yellow-500" : "bg-gray-500"}`}
            onClick={() => setLanguage("tr")}
          >
            TR
          </button>
          <button
            className={`px-3 py-1 rounded-lg text-sm ${language === "en" ? "bg-yellow-500" : "bg-gray-500"}`}
            onClick={() => setLanguage("en")}
          >
            EN
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
