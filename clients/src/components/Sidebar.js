import { useNavigate } from "react-router-dom";
import { FaTimes } from "react-icons/fa";

const Sidebar = ({ menuOpen, setMenuOpen, darkMode, language }) => {
  const navigate = useNavigate();

  const translations = {
    tr: {
      home: "Anasayfa - ToDo",
      calendar: "Genel Görevli Takvim",
      pomodoro: "Pomodoro - Çalışma Saati Sıralama",
      scoreboard: "Puanlama Tablosu",
      game: "Mini Oyun",
      team: "Takım Arkadaşlarım",
    },
    en: {
      home: "Home - ToDo",
      calendar: "General Task Calendar",
      pomodoro: "Pomodoro - Work Session Ranking",
      scoreboard: "Scoreboard",
      game: "Mini Game",
      team: "Team Members",
    }
  };

  return (
    <div className={`fixed top-0 left-0 h-full w-64 ${darkMode ? "bg-gray-900 text-white" : "bg-blue-900 text-white"} transform ${menuOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 shadow-lg z-50`}>
      {/* Kapat Butonu */}
      <button className="absolute top-4 right-4 text-white text-2xl" onClick={() => setMenuOpen(false)}>
        <FaTimes />
      </button>

      {/* Menü Başlığı */}
      <h3 className="text-lg font-bold mt-10 px-6">Menü</h3>

      {/* Menü Butonları */}
      <nav className="mt-6 flex flex-col gap-4 px-6">
        <button className="text-left py-2 px-4 rounded-lg hover:bg-blue-700 transition" onClick={() => { navigate("/home"); setMenuOpen(false); }}>
          {translations[language].home}
        </button>
        <button className="text-left py-2 px-4 rounded-lg hover:bg-blue-700 transition" onClick={() => { navigate("/calendar"); setMenuOpen(false); }}>
          {translations[language].calendar}
        </button>
        <button className="text-left py-2 px-4 rounded-lg hover:bg-blue-700 transition" disabled>
          {translations[language].pomodoro}
        </button>
        <button className="text-left py-2 px-4 rounded-lg hover:bg-blue-700 transition" disabled>
          {translations[language].scoreboard}
        </button>
        <button className="text-left py-2 px-4 rounded-lg hover:bg-blue-700 transition" disabled>
          {translations[language].game}
        </button>
        <button 
          className="text-left py-2 px-4 rounded-lg hover:bg-blue-700 transition" 
          onClick={() => { navigate("/team-members"); setMenuOpen(false); }}>
          {translations[language].team}
        </button>
      </nav>
    </div>
  );
};

export default Sidebar;
