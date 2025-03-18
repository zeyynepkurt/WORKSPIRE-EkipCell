import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { FaPlay, FaPause, FaRedo } from "react-icons/fa";
import { FaBars, FaBell, FaEnvelope, FaUserCircle, FaSearch, FaSun, FaMoon } from "react-icons/fa";

const Pomodoro = () => {
  const [time, setTime] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [language, setLanguage] = useState("tr");
  const [sessions, setSessions] = useState([]);
  const [customTime, setCustomTime] = useState(25);
  const navigate = useNavigate();

  useEffect(() => {
    let timer;
    if (isRunning && time > 0) {
      timer = setInterval(() => setTime((prev) => prev - 1), 1000);
    } else if (time === 0) {
      setIsRunning(false);
      setSessions((prev) => [...prev, { id: prev.length + 1, duration: `${customTime}:00` }]);
      setTime(customTime * 60);
    }
    return () => clearInterval(timer);
  }, [isRunning, time]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className={`${darkMode ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-900"} h-screen p-6 relative flex`}>      
      <Sidebar menuOpen={menuOpen} setMenuOpen={setMenuOpen} darkMode={darkMode} language={language} />
      <div className="flex-1 flex flex-col">
        <nav className={`flex justify-between items-center p-4 ${darkMode ? "bg-blue-800" : "bg-blue-900"} text-white shadow-md rounded-xl relative z-40`}>
          <div className="flex items-center gap-4">
            <button onClick={() => setMenuOpen(true)} className="text-2xl">
              <FaBars />
            </button>
            <div className="relative w-full max-w-md">
              <input type="text" placeholder={language === "tr" ? "Ara..." : "Search..."} className="w-full px-4 py-2 rounded-full text-black focus:outline-none shadow-md" />
              <FaSearch className="absolute right-3 top-3 text-gray-600" />
            </div>
          </div>
          <div className="flex items-center gap-6">
            <FaEnvelope className="text-2xl cursor-pointer" />
            <FaBell className="text-2xl cursor-pointer" />
            <FaUserCircle className="text-3xl cursor-pointer" />
            <button onClick={() => setDarkMode(!darkMode)} className="text-xl">
              {darkMode ? <FaSun className="text-yellow-400" /> : <FaMoon className="text-yellow-500" />}
            </button>
            <div className="flex gap-2">
              <button className={`px-3 py-1 rounded-lg text-sm ${language === "tr" ? "bg-yellow-500" : "bg-gray-500"}`} onClick={() => setLanguage("tr")}>TR</button>
              <button className={`px-3 py-1 rounded-lg text-sm ${language === "en" ? "bg-yellow-500" : "bg-gray-500"}`} onClick={() => setLanguage("en")}>EN</button>
            </div>
          </div>
        </nav>

        <div className="flex justify-between p-10">
          {/* Sol tarafta sayaç */}
          <div className={`flex flex-col items-center p-10 ${darkMode ? "bg-gray-700 text-gray-400" : "bg-yellow-100 text-gray-900"} shadow-lg rounded-lg w-1/2`}>
          <img src="/assets/pomodoro.gif" alt="Pomodoro Timer Animation" className="w-32 h-32 mb-4" />
            <h1 className="text-3xl font-bold mb-4">{language === "tr" ? "Pomodoro Zamanlayıcı" : "Pomodoro Timer"}</h1>
            <input 
              type="number" 
              value={customTime} 
              onChange={(e) => setCustomTime(e.target.value)}
              className="border p-2 rounded mb-4 w-24 text-center"
            />
            <button 
              className="bg-blue-600 text-white px-4 py-2 rounded mb-4" 
              onClick={() => setTime(customTime * 60)}
            >
              {language === "tr" ? "Süreyi Ayarla" : "Set Time"}
            </button>
            <h2 className="text-6xl font-bold">{formatTime(time)}</h2>
            <div className="flex justify-center gap-6 mt-6">
              <button 
                className={`px-6 py-3 ${isRunning ? "bg-red-500" : "bg-green-500"} text-white rounded-full text-xl`} 
                onClick={() => setIsRunning(!isRunning)}
              >
                {isRunning ? <FaPause /> : <FaPlay />}
              </button>
              <button 
                className="px-6 py-3 bg-blue-500 text-white rounded-full text-xl" 
                onClick={() => { setIsRunning(false); setTime(customTime * 60); }}
              >
                <FaRedo />
              </button>
            </div>
          </div>

          {/* Sağ tarafta çalışma süreleri */}
          <div className={`w-1/3 ${darkMode ? "bg-gray-700 text-gray-400" : "bg-yellow-100 text-gray-900"} shadow-lg rounded-lg p-6`}>
            <h2 className="text-2xl font-bold mb-4">{language === "tr" ? "Haftalık Çalışma Süresi" : "Weekly Work Sessions"}</h2>
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 px-4 py-2">{language === "tr" ? "#" : "#"}</th>
                  <th className="border border-gray-300 px-4 py-2">{language === "tr" ? "Süre" : "Duration"}</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((session) => (
                  <tr key={session.id} className="text-center">
                    <td className="border border-gray-300 px-4 py-2">{session.id}</td>
                    <td className="border border-gray-300 px-4 py-2">{session.duration}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};


export default Pomodoro;
