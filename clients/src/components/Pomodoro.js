import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { FaPlay, FaPause, FaRedo } from "react-icons/fa";

const Pomodoro = () => {
  const [time, setTime] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [customTime, setCustomTime] = useState(25);

  const { darkMode, language } = useOutletContext();

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

  const translations = {
    tr: {
      title: "Pomodoro Zamanlayıcı",
      setTime: "Süreyi Ayarla",
      workLog: "Haftalık Çalışma Süresi",
      duration: "Süre"
    },
    en: {
      title: "Pomodoro Timer",
      setTime: "Set Time",
      workLog: "Weekly Work Sessions",
      duration: "Duration"
    }
  };

  return (
    <div className={`w-full pt-16 px-4 md:px-8 lg:px-16 ${darkMode ? "bg-[#0f172a] text-white" : "bg-white text-gray-900"}`}>
      <div className="flex flex-col lg:flex-row justify-center gap-6">
        
        {/* Sol: Sayaç */}
        <div className={`flex-1 p-8 rounded-2xl shadow-lg ${darkMode ? "bg-blue-900 text-white" : "bg-yellow-100 text-gray-900"}`}>
          <div className="flex flex-col items-center">
            <img src="/assets/pomodoro.gif" alt="Pomodoro Timer" className="w-32 h-32 mb-4" />
            <h1 className="text-3xl font-bold mb-4">{translations[language].title}</h1>
            <input 
              type="number" 
              value={customTime} 
              onChange={(e) => setCustomTime(e.target.value)}
              className="border p-2 rounded mb-4 w-24 text-center text-black"
            />
            <button 
              className="bg-blue-600 text-white px-4 py-2 rounded mb-4" 
              onClick={() => setTime(customTime * 60)}
            >
              {translations[language].setTime}
            </button>
            <h2 className="text-6xl font-bold mb-6">{formatTime(time)}</h2>
            <div className="flex justify-center gap-6">
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
        </div>

        {/* Sağ: Oturum Listesi */}
        <div className={`w-full lg:w-1/3 p-8 rounded-2xl shadow-lg ${darkMode ? "bg-blue-900 text-white" : "bg-yellow-100 text-gray-900"}`}>
          <h2 className="text-2xl font-bold mb-4">{translations[language].workLog}</h2>
          <table className="w-full border-collapse border border-gray-300 text-sm">
            <thead>
              <tr className="bg-gray-200 text-black">
                <th className="border border-gray-300 px-4 py-2">#</th>
                <th className="border border-gray-300 px-4 py-2">{translations[language].duration}</th>
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
  );
};

export default Pomodoro;
