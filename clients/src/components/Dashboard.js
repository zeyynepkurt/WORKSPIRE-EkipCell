import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import axios from "axios";
import { FaTrash } from "react-icons/fa";

const Dashboard = () => {
  const { darkMode, language } = useOutletContext();
  const [personalTasks, setPersonalTasks] = useState([]);
  const [assignedTasks, setAssignedTasks] = useState([]);
  const [newPersonalTask, setNewPersonalTask] = useState("");
  const [showAiBox, setShowAiBox] = useState(false);
  const [aiTasks, setAiTasks] = useState([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState(null);


  const userId = localStorage.getItem("employeeId");

  useEffect(() => {
    fetchPersonalTasks();
    fetchAssignedTasks();
  }, []);

  const fetchAiTasks = async () => {
    setAiLoading(true);
    setAiError(null);
    try {
      const response = await axios.get(`http://localhost:5000/prioritizer/data?employeeId=${userId}`);
      setAiTasks(response.data);
    } catch (error) {
      setAiError("AI görevleri alınamadı.");
    } finally {
      setAiLoading(false);
    }
  };


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
      const response = await axios.get(`http://localhost:5000/employees/assigned-tasks/${userId}`);
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
    try {
      await axios.put(`http://localhost:5000/api/todos/${taskId}`, {
        is_completed: !currentStatus,
      });
      setPersonalTasks((tasks) =>
        tasks.map((task) =>
          task.todo_id === taskId ? { ...task, is_completed: !currentStatus } : task
        )
      );
    } catch (error) {
      console.error("Kişisel görev güncelleme hatası:", error);
    }
  };

  const toggleCompletionAssigned = async (taskId, currentStatus) => {
    try {
      console.log(`Görev ID: ${taskId} - Şu Anki Durum: ${currentStatus}`);  // Hangi görevin işaretlendiğini görmek için

      const response = await axios.put(`http://localhost:5000/complete-task/${taskId}`);

      if (response.data.message === "Görev başarıyla tamamlandı.") {
          console.log("Görev başarıyla tamamlandı!");  // Başarılı yanıtı console'da gör

          setAssignedTasks((tasks) =>
              tasks.map((task) =>
                  task.task_id === taskId ? { ...task, is_completed: true } : task
              )
          );
      } else {
          console.log("Görev tamamlanamadı:", response.data.message);
      }
    } catch (error) {
      console.error("Atanan görev güncelleme hatası:", error);
    }
};



  const deleteTask = async (taskId) => {
    try {
      await axios.delete(`http://localhost:5000/api/todos/${taskId}`);
      setPersonalTasks((tasks) => tasks.filter((t) => t.todo_id !== taskId));
    } catch (error) {
      console.error("Silme hatası:", error);
    }
  };

  const translations = {
    tr: {
      newTask: "Yeni görev ekle...",
      personalTasks: "Kişisel Görevler",
      assignedTasks: "Atanan Görevler",
      completed: "✓",
      taskName: "Görev Adı",
      description: "Açıklama",
      score: "Puan",
      deadline: "Son Tarih",
      noTask: "Henüz atanmış görev yok."
    },
    en: {
      newTask: "Add new task...",
      personalTasks: "Personal Tasks",
      assignedTasks: "Assigned Tasks",
      completed: "✓",
      taskName: "Task Name",
      description: "Description",
      score: "Score",
      deadline: "Deadline",
      noTask: "No assigned tasks yet."
    },
  };

  return (
    <div className={`w-full pt-28 px-4 md:px-8 lg:px-16 pb-20 ${darkMode ? "bg-[#0f172a] text-white" : "bg-white text-gray-900"} min-h-screen`}>
      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Kişisel Görevler */}
        <div className={`p-6 rounded-2xl shadow-lg ${darkMode ? "bg-blue-900 text-white" : "bg-yellow-100 text-gray-900"}`}>
          <h2 className="text-2xl font-semibold mb-4 text-center">{translations[language].personalTasks}</h2>

          <div className="flex gap-3 mb-4">
            <input
              type="text"
              value={newPersonalTask}
              onChange={(e) => setNewPersonalTask(e.target.value)}
              placeholder={translations[language].newTask}
              className="w-full px-4 py-2 border rounded-full focus:outline-none shadow-sm bg-blue-100 text-black"
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
                <span className={task.is_completed ? "line-through text-gray-300" : ""}>
                  {task.title}
                </span>
                <FaTrash onClick={() => deleteTask(task.todo_id)} className="cursor-pointer text-red-500" />
              </li>
            ))}
          </ul>
        </div>

        {/* Atanan Görevler */}
        <div className={`p-6 rounded-2xl shadow-lg ${darkMode ? "bg-blue-900 text-white" : "bg-yellow-100 text-gray-900"}`}>
          <h2 className="text-2xl font-semibold mb-4 text-center">{translations[language].assignedTasks}</h2>

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
                  {new Date(task.deadline).toLocaleDateString(language === "tr" ? "tr-TR" : "en-US")}
                </span>
              </div>
            ))
          ) : (
            <p className="text-center py-2">{translations[language].noTask}</p>
          )}
        </div>


          {/* Sağ alt köşedeki AI simgesi */}
              <div
                className="fixed bottom-6 right-6 z-50 cursor-pointer"
                onClick={() => {
                  setShowAiBox(!showAiBox);
                  if (!showAiBox) fetchAiTasks();
                }}
              >
                <img
                  src={require("../assets/ai-icon.png")}
                  alt="AI Prioritize"
                  className="w-20 h-20 hover:scale-105 transition-transform duration-200"
                />
              </div>
      </div>
      
      {showAiBox && (
        <div className={`fixed bottom-28 right-6 z-50 w-80 max-h-96 overflow-auto rounded-xl shadow-lg p-4 ${darkMode ? "bg-slate-800 text-white" : "bg-white text-gray-800"}`}>
          <h3 className="text-lg font-semibold mb-2">📊 AI Önceliklendirme</h3>
          {aiLoading ? (
            <p>Yükleniyor...</p>
          ) : aiError ? (
            <p className="text-red-500">{aiError}</p>
          ) : (
            <ul className="space-y-2">
              {aiTasks.map((task, index) => (
                <li key={task.task_id} className="border-b pb-2">
                  <strong>{index + 1}. {task.task_name}</strong><br />
                  <span className="text-sm text-blue-500">Skor: {task.predicted_priority.toFixed(2)}</span>
                </li>
              ))}
            </ul>
          )}
          </div>
        )}
    </div>
  );
};

export default Dashboard;
