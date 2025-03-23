import { useState, useEffect } from "react";
import { FaBars, FaBell, FaEnvelope, FaUserCircle, FaSearch, FaTrash, FaTimes, FaSun, FaMoon } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar"; // Sidebar bileşeni
import TaskList from "./TaskList";


const Dashboard = () => {
  const [personalTasks, setPersonalTasks] = useState([]);
  const [assignedTasks, setAssignedTasks] = useState([]);
  const [newPersonalTask, setNewPersonalTask] = useState("");
  const [newAssignedTask, setNewAssignedTask] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [language, setLanguage] = useState("tr");
  const navigate = useNavigate();

  
  const userId = parseInt(localStorage.getItem("userId"));

  useEffect(() => {
    if (!userId) {
      console.warn("userId bulunamadı, localStorage'dan alınamadı");
      return;
    }

    fetch(`http://localhost:5000/api/todos/${userId}`)
      .then((res) => res.json())
      .then((data) => setPersonalTasks(data))
      .catch((err) => console.error("Görevler alınamadı:", err));
  }, [userId]);


  const handleAddTask = async () => {
    if (!newPersonalTask.trim()) return;
  
    const newTask = {
      user_id: userId, // 👈 Bu burada olmalı
      title: newPersonalTask,
      description: "",
    };
  
    const res = await fetch("http://localhost:5000/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTask),
    });
  
    const added = await res.json();
    setPersonalTasks((prev) => [added, ...prev]);
    setNewPersonalTask("");
  };
  

  // Görev tamamlandı/tamamlanmadı toggle
  const toggleCompletion = async (taskId, currentStatus) => {
    await fetch(`http://localhost:5000/api/todos/${taskId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_completed: !currentStatus })
    });

    setPersonalTasks(tasks =>
      tasks.map(task => task.todo_id === taskId ? { ...task, is_completed: !currentStatus } : task)
    );
  };

  // Görev sil
  const deleteTask = async (taskId) => {
    await fetch(`http://localhost:5000/api/todos/${taskId}`, { method: "DELETE" });
    setPersonalTasks(tasks => tasks.filter(t => t.todo_id !== taskId));
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
    <div className={`${darkMode ? "bg-gray-800 text-gray-200" : "bg-gray-100 text-gray-900"} h-screen p-6 relative flex`}>
      {/* Sidebar */}
      <div className={`fixed top-0 left-0 h-full w-64 bg-blue-900 text-white transform ${menuOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 shadow-lg z-50`}>
        <button className="absolute top-4 right-4 text-white text-2xl" onClick={() => setMenuOpen(false)}>
          <FaTimes />
        </button>
        <Sidebar menuOpen={menuOpen} setMenuOpen={setMenuOpen} darkMode={darkMode} language={language} />
      </div>

      <div className="flex flex-col flex-grow">
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

        {/* Görev Kutusu */}
        <div className={`p-6 mt-6 rounded-2xl shadow-lg ${darkMode ? "bg-gray-700 text-gray-300" : "bg-yellow-100 text-gray-900"}`}>
          <h2 className="text-2xl font-semibold mb-4 text-center">{translations[language].personalTasks}</h2>

          <div className="flex gap-3 mb-4">
            <input
              type="text"
              value={newPersonalTask}
              onChange={(e) => setNewPersonalTask(e.target.value)}
              placeholder={translations[language].newTask}
              className="w-full px-4 py-2 border rounded-full focus:outline-none shadow-sm"
            />
            <button onClick={handleAddTask} className="px-4 py-2 rounded-full bg-blue-600 text-white">➕</button>
          </div>

          <ul>
            {personalTasks.map(task => (
              <li key={task.todo_id} className="flex justify-between items-center p-2 border-b">
                <input
                  type="checkbox"
                  checked={task.is_completed}
                  onChange={() => toggleCompletion(task.todo_id, task.is_completed)}
                  className="cursor-pointer"
                />
                <span className={task.is_completed ? "line-through text-gray-500" : ""}>
                  {task.title}
                </span>
                <FaTrash onClick={() => deleteTask(task.todo_id)} className="cursor-pointer text-red-500" />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
