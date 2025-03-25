import { useState, useEffect } from "react";
import { FaBars, FaBell, FaEnvelope, FaUserCircle, FaSearch, FaTrash, FaTimes, FaSun, FaMoon } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import axios from "axios";

const Dashboard = () => {
  const [personalTasks, setPersonalTasks] = useState([]);
  const [assignedTasks, setAssignedTasks] = useState([]);
  const [newPersonalTask, setNewPersonalTask] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [language, setLanguage] = useState("tr");

  const userId = localStorage.getItem("employeeId");
  const navigate = useNavigate();

  useEffect(() => {
    fetchPersonalTasks();
    fetchAssignedTasks();
  }, []);

  const fetchPersonalTasks = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/todos/${userId}`);
      setPersonalTasks(response.data);
    } catch (error) {
      console.error("Kişisel görevler yüklenemedi:", error);
    }
  };

  const fetchAssignedTasks = async () => {
    try {
      const employeeId = localStorage.getItem("employeeId"); // ID'yi localStorage'dan çektiğinden emin ol!
      const response = await axios.get(`http://localhost:5000/employees/assigned-tasks/${employeeId}`);
      setAssignedTasks(response.data);
    } catch (error) {
      console.error("Atanan görevler yüklenemedi:", error);
    }
  };

  const handleAddPersonalTask = async () => {
    if (!newPersonalTask.trim()) return;

    try {
      const response = await axios.post("http://localhost:5000/api/todos", {
        user_id: userId,
        title: newPersonalTask,
      });

      if (response.data) {
        setPersonalTasks((prev) => [response.data, ...prev]);
        setNewPersonalTask("");
      }
    } catch (error) {
      console.error("Görev eklenemedi:", error);
    }
  };

  const toggleCompletion = async (taskId, currentStatus) => {
    await axios.put(`http://localhost:5000/api/todos/${taskId}`, { is_completed: !currentStatus });

    setPersonalTasks((tasks) =>
      tasks.map((task) =>
        task.todo_id === taskId ? { ...task, is_completed: !currentStatus } : task
      )
    );
  };

  const toggleCompletionAssigned = async (taskId, currentStatus) => {
    try {
      await axios.put(`http://localhost:5000/employees/assigned-tasks/${taskId}`, { 
        is_completed: !currentStatus 
      });
  
      setAssignedTasks((tasks) =>
        tasks.map((task) =>
          task.task_id === taskId ? { ...task, is_completed: !currentStatus } : task
        )
      );
    } catch (error) {
      console.error("Toggle hatası:", error);
    }
  };
  

  

  const deleteTask = async (taskId) => {
    await axios.delete(`http://localhost:5000/api/todos/${taskId}`);
    setPersonalTasks((tasks) => tasks.filter((t) => t.todo_id !== taskId));
  };

  const translations = {
    tr: {
      search: "Ara...",
      personalTasks: "Kişisel Görevler",
      assignedTasks: "Atanan Görevler",
      newTask: "Yeni görev ekle...",
      completed: "✓",
      taskName: "Görev Adı",
      description: "Açıklama",
      score: "Puan",
      deadline: "Son Tarih",
      noTask: "Henüz atanmış görev yok."
    },
    en: {
      search: "Search...",
      personalTasks: "Personal Tasks",
      assignedTasks: "Assigned Tasks",
      newTask: "Add new task...",
      completed: "✓",
      taskName: "Task Name",
      description: "Description",
      score: "Score",
      deadline: "Deadline",
      noTask: "No assigned tasks yet."
    },
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
            <button onClick={() => setMenuOpen(true)} className="text-2xl"><FaBars /></button>
            <div className="relative w-full max-w-md">
              <input type="text" placeholder={translations[language].search} className="w-full px-4 py-2 rounded-full text-black focus:outline-none shadow-md" />
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

        {/* Görevler Alanı */}
        <div className="grid grid-cols-2 gap-6 mt-6">
          {/* Kişisel Görevler */}
          <div className={`p-6 rounded-2xl shadow-lg ${darkMode ? "bg-gray-700 text-gray-300" : "bg-yellow-100 text-gray-900"}`}>
            <h2 className="text-2xl font-semibold mb-4 text-center">{translations[language].personalTasks}</h2>

            <div className="flex gap-3 mb-4">
              <input
                type="text"
                value={newPersonalTask}
                onChange={(e) => setNewPersonalTask(e.target.value)}
                placeholder={translations[language].newTask}
                className="w-full px-4 py-2 border rounded-full focus:outline-none shadow-sm"
              />
              <button onClick={handleAddPersonalTask} className="px-4 py-2 rounded-full bg-blue-600 text-white">➕</button>
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

        {/* Atanan Görevler */}
        <div className={`p-6 rounded-2xl shadow-lg ${darkMode ? "bg-gray-700 text-gray-300" : "bg-yellow-100 text-gray-900"}`}>
          <h2 className="text-2xl font-semibold mb-4 text-center">
            {translations[language].assignedTasks}
          </h2>

          <div className="grid grid-cols-12 font-bold border-b pb-2 mb-2">
            <span className="col-span-1 text-center">{translations[language].completed}</span>
            <span className="col-span-4">{translations[language].taskName}</span>
            <span className="col-span-3">{translations[language].description}</span>
            <span className="col-span-2 text-center">{translations[language].score}</span>
            <span className="col-span-2 text-center">{translations[language].deadline}</span>
          </div>


          {assignedTasks.length > 0 ? (
            assignedTasks.map((task) => (
              <div key={task.task_id} className="grid grid-cols-12 items-center py-2 border-b">
                <input
                  type="checkbox"
                  checked={task.is_completed}
                  onChange={() => toggleCompletionAssigned(task.task_id, task.is_completed)}
                  className="cursor-pointer col-span-1 justify-self-center"
                />
                <span className={`col-span-4 ${task.is_completed ? "line-through text-gray-500" : ""}`}>
                  {task.task_name}
                </span>
                <span className={`col-span-3 ${task.is_completed ? "line-through text-gray-500" : ""}`}>
                  {task.task_description}
                </span>
                <span className={`col-span-2 text-center ${task.is_completed ? "line-through text-gray-500" : ""}`}>
                  {task.score}
                </span>
                <span className={`col-span-2 text-center ${task.is_completed ? "line-through text-gray-500" : ""}`}>
                  {new Date(task.deadline).toLocaleDateString('tr-TR')}
                </span>
              </div>

            ))
          ) : (
            <p className="text-center py-2">{translations[language].noTask}</p>
          )}

        </div>


        </div>
      </div>
    </div>
  );
};

export default Dashboard;
