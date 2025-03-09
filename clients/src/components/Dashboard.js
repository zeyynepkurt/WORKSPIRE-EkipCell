import { useState } from "react";
import { FaBars, FaBell, FaEnvelope, FaUserCircle, FaSearch, FaTrash, FaTimes, FaSun, FaMoon } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [personalTasks, setPersonalTasks] = useState([]);
  const [assignedTasks, setAssignedTasks] = useState([]);
  const [newPersonalTask, setNewPersonalTask] = useState("");
  const [newAssignedTask, setNewAssignedTask] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [language, setLanguage] = useState("tr");
  const navigate = useNavigate();

  const addTask = (listSetter, newTaskSetter, newTaskValue) => {
    if (newTaskValue.trim() !== "") {
      listSetter(prevTasks => [...prevTasks, { id: prevTasks.length + 1, title: newTaskValue, completed: false }]);
      newTaskSetter("");
    }
  };

  const toggleTaskCompletion = (listSetter, id) => {
    listSetter(prevTasks =>
      prevTasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const translations = {
    tr: {
      home: "Anasayfa - ToDo",
      calendar: "Genel Görevli Takvim",
      pomodoro: "Pomodoro - Çalışma Saati Sıralama",
      scoreboard: "Puanlama Tablosu",
      game: "Mini Oyun",
      team: "Takım Arkadaşlarım",
      search: "Ara...",
      newTask: "Yeni görev ekle...",
      personalTasks: "Kişisel Görevler",
      assignedTasks: "Atanan Görevler"
    },
    en: {
      home: "Home - ToDo",
      calendar: "General Task Calendar",
      pomodoro: "Pomodoro - Work Session Ranking",
      scoreboard: "Scoreboard",
      game: "Mini Game",
      team: "Team Members",
      search: "Search...",
      newTask: "Add new task...",
      personalTasks: "Personal Tasks",
      assignedTasks: "Assigned Tasks"
    }
  };

  return (
    <div className={`${darkMode ? "bg-gray-800 text-gray-200" : "bg-gray-100 text-gray-900"} h-screen p-6 relative`}>
      {/* Sidebar Menu */}
      <div className={`fixed top-0 left-0 h-full w-64 bg-blue-900 text-white transform ${menuOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 shadow-lg z-50`}>
        <button className="absolute top-4 right-4 text-white text-2xl" onClick={() => setMenuOpen(false)}>
          <FaTimes />
        </button>
        <nav className="mt-12 flex flex-col gap-4 px-6">
          <button className="text-left py-2 px-4 rounded-lg hover:bg-blue-700 transition" onClick={() => navigate("/home")}>{translations[language].home}</button>
          <button className="text-left py-2 px-4 rounded-lg hover:bg-blue-700 transition" onClick={() => navigate("/calendar")}>{translations[language].calendar}</button>          
          <button className="text-left py-2 px-4 rounded-lg hover:bg-blue-700 transition" disabled>{translations[language].pomodoro}</button>
          <button className="text-left py-2 px-4 rounded-lg hover:bg-blue-700 transition" disabled>{translations[language].scoreboard}</button>
          <button className="text-left py-2 px-4 rounded-lg hover:bg-blue-700 transition" disabled>{translations[language].game}</button>
          <button className="text-left py-2 px-4 rounded-lg hover:bg-blue-700 transition" disabled>{translations[language].team}</button>
        </nav>
      </div>

      {/* Navbar */}
      <nav className={`flex justify-between items-center p-4 ${darkMode ? "bg-blue-800" : "bg-blue-900"} text-white shadow-md rounded-xl relative z-40`}>
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

      {/* Task Lists */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {[['personalTasks', personalTasks, setPersonalTasks, newPersonalTask, setNewPersonalTask], ['assignedTasks', assignedTasks, setAssignedTasks, newAssignedTask, setNewAssignedTask]].map(([key, tasks, setter, newTaskValue, newTaskSetter]) => (
          <div key={key} className={`p-6 rounded-2xl shadow-lg ${darkMode ? "bg-gray-700 text-gray-300" : "bg-yellow-100 text-gray-900"}`}>
            <h2 className="text-2xl font-semibold mb-4 text-center">{translations[language][key]}</h2>
            <div className="flex gap-3 mb-4">
              <input type="text" value={newTaskValue} onChange={(e) => newTaskSetter(e.target.value)} placeholder={translations[language].newTask} className="w-full px-4 py-2 border rounded-full focus:outline-none shadow-sm" />
              <button onClick={() => addTask(setter, newTaskSetter, newTaskValue)} className="px-4 py-2 rounded-full bg-blue-600 text-white">➕</button>
            </div>
            <ul>
              {tasks.map((task) => (
                <li key={task.id} className="flex justify-between items-center p-2 border-b">
                  <input type="checkbox" checked={task.completed} onChange={() => toggleTaskCompletion(setter, task.id)} className="cursor-pointer" />
                  <span className={task.completed ? "line-through text-gray-500" : ""}>{task.title}</span>
                  <FaTrash onClick={() => setter(tasks.filter(t => t.id !== task.id))} className="cursor-pointer text-red-500" />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;