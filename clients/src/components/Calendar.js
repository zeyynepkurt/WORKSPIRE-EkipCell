import { useState, useEffect } from "react";
import { FaBars, FaBell, FaEnvelope, FaUserCircle, FaSearch, FaTimes, FaSun, FaMoon, FaChevronLeft, FaChevronRight, FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import dayjs from "dayjs";
import "dayjs/locale/tr";
import "dayjs/locale/en";
import { months } from "dayjs/locale/tr";

const TaskCalendar = () => {
    const [darkMode, setDarkMode] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [language, setLanguage] = useState("tr");
    const [viewMode, setViewMode] = useState("personal"); // Toggle için state
    const navigate = useNavigate();
    const [selectedMonth, setSelectedMonth] = useState(dayjs().month());
    const [selectedYear, setSelectedYear] = useState(dayjs().year());
    const [currentWeek, setCurrentWeek] = useState(dayjs().year(selectedYear).month(selectedMonth).startOf("week"));
    const [newTaskTitle, setNewTaskTitle] = useState("");
    const [newMeetingTitle, setNewMeetingTitle] = useState("");
    const [newMeetingParticipants, setNewMeetingParticipants] = useState("");
    const [newTaskDate, setNewTaskDate] = useState(dayjs().format("YYYY-MM-DD"));
    const [newTaskTime, setNewTaskTime] = useState("12:00");
    const [tasks, setTasks] = useState([]);
    const [meetings, setMeetings] = useState([]);

    const translations = {
        tr: {
            calendar: "Genel Görevli Takvim",
            search: "Ara...",
            tasks: "Görevler",
            addTask: "Görev Ekle",
            addMeeting: "Toplantı Ekle",
            taskTitle: "Görev Konusu",
            meetingTitle: "Toplantı Konusu",
            meetingParticipants: "Katılımcılar",
            taskDate: "Gün Seç",
            taskTime: "Saat Seç",
            selectMonth: "Ay Seç",
            selectYear: "Yıl Seç",
            personal: "Bireysel Takvim",
            team: "Ekip Takvimi",
            days: ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"],
            months: ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"]
        },
        en: {
            calendar: "General Task Calendar",
            search: "Search...",
            tasks: "Tasks",
            addTask: "Add Task",
            addMeeting: "Add Meeting",
            taskTitle: "Task Title",
            meetingTitle: "Meeting Title",
            meetingParticipants: "Participants",
            taskDate: "Select Date",
            taskTime: "Select Time",
            selectMonth: "Select Month",
            selectYear: "Select Year",
            personal: "Personal Calendar",
            team: "Team Calendar",
            days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
            months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
        }
      };

  // Seçilen Ay/Yıla Göre Güncellenen Haftalık Günler
  useEffect(() => {
    setCurrentWeek(dayjs().locale(language).year(selectedYear).month(selectedMonth).startOf("week"));
  }, [selectedMonth, selectedYear, language]);

  const getWeekDays = () => {
    return [...Array(7)].map((_, i) => currentWeek.add(i, "day").format("YYYY-MM-DD"));
  };

  const previousWeek = () => setCurrentWeek(currentWeek.subtract(1, "week"));
  const nextWeek = () => setCurrentWeek(currentWeek.add(1, "week"));

  const addTask = () => {
    if (newTaskTitle.trim() === "") return;
    const newTask = {
      id: tasks.length + 1,
      date: newTaskDate,
      time: newTaskTime,
      title: newTaskTitle
    };
    setTasks([...tasks, newTask]);
    setNewTaskTitle("");
  };

  const addMeeting = () => {
        if (newMeetingTitle.trim() === "" || newMeetingParticipants.trim() === "") return;
        const newMeeting = {
            id: meetings.length + 1,
            date: newTaskDate,
            time: newTaskTime,
            title: newMeetingTitle,
            participants: newMeetingParticipants
        };
        setMeetings([...meetings, newMeeting]);
        setNewMeetingTitle("");
        setNewMeetingParticipants("");
    };
  return (
    <div className={`${darkMode ? "bg-gray-800 text-blue-900" : "bg-gray-100 text-blue-900"} h-screen p-6 relative flex`}>
      <div className={`fixed top-0 left-0 h-full w-64 bg-blue-900 text-white transform ${menuOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 shadow-lg z-50`}>
        <button className="absolute top-4 right-4 text-white text-2xl" onClick={() => setMenuOpen(false)}>
          <FaTimes />
        </button>
        <Sidebar menuOpen={menuOpen} setMenuOpen={setMenuOpen} darkMode={darkMode} language={language} />
      </div>

      <div className="flex flex-col flex-grow">
        <nav className={`flex justify-between items-center p-4 ${darkMode ? "bg-blue-800" : "bg-blue-900"} text-white shadow-md rounded-xl relative z-40`}>
          <div className="flex items-center gap-4">
            <button onClick={() => setMenuOpen(true)} className="text-2xl">
              <FaBars />
            </button>
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

        {/* Toggle Butonu */}
        <div className="flex justify-center my-4">
          <button className={`px-6 py-2 rounded-l-lg ${viewMode === "personal" ? "bg-blue-600 text-white" : "bg-gray-300"}`} onClick={() => setViewMode("personal")}>
            {translations[language].personal}
          </button>
          <button className={`px-6 py-2 rounded-r-lg ${viewMode === "team" ? "bg-blue-600 text-white" : "bg-gray-300"}`} onClick={() => setViewMode("team")}>
            {translations[language].team}
          </button>
        </div>
        <h1 className={`${darkMode ? "text-gray-400" : "text-blue-600"} text-2xl font-bold mb-4 text-center`}>{translations[language].calendar}</h1>
        {/* Ay/Yıl Seçimi ve Haftalık Geçiş */}
        <div className="flex justify-center items-center space-x-20 p-2 mb-2 "> {/* Aralık küçültüldü ve sağa yaslandı */}
            <button className="px-3 py-1 bg-blue-600 text-white rounded-lg" onClick={previousWeek}>
                <FaChevronLeft />
            </button>
            <select className="p-1 border rounded text-sm bg-gray-200" value={selectedMonth} onChange={(e) => setSelectedMonth(parseInt(e.target.value))}>
                {translations[language].months.map((month, i) => (
                <option key={i} value={i}>{month}</option>
                ))}
            </select>
            <select className="p-1 border rounded text-sm bg-gray-200" value={selectedYear} onChange={(e) => setSelectedYear(parseInt(e.target.value))}>
                {Array.from({ length: 5 }, (_, i) => (
                <option key={i} value={dayjs().year() - 2 + i}>{dayjs().year() - 2 + i}</option>
                ))}
            </select>
            <button className="px-3 py-1 bg-blue-600 text-white rounded-lg" onClick={nextWeek}>
                <FaChevronRight />
            </button>
        </div>
        {/* Bireysel Takvim */}
        {viewMode === "personal" ? (
            <div className="flex">
            {/* Takvim */}
            <div className={`${darkMode ? "bg-gray-700 text-gray-500" : "bg-yellow-100 text-gray-900"} p-6 w-full rounded-lg mr-6`}> {/* Sağ boşluk eklendi */}
                
                <div className="grid grid-cols-7 gap-2 "> {/* Aralık küçültüldü */}
                {getWeekDays().map((day, i) => (
                    <div key={day} className="p-3 bg-white rounded-lg shadow-md w-full"> {/* İç padding küçültüldü */}
                    <h3 className="text-sm font-semibold">{dayjs(day).format("DD")} {translations[language].days[i]}</h3>  
                    <ul className="mt-1">
                        {tasks.filter(task => task.date === day).map(task => (
                        <li key={task.id} className="text-xs bg-gray-200 p-1 rounded mt-1"> {/* İç padding küçültüldü */}
                            {task.time} - {task.title}
                        </li>
                        ))}
                    </ul>
                    </div>
                ))}
                </div>
            </div>

            
            <div className={`${darkMode ? "bg-gray-700 text-gray-400" : "bg-yellow-100 text-gray-900"} w-1/4 p-6 shadow-lg rounded-lg mt-6`}> {/* Üst boşluk eklendi */}
                <h3 className="text-lg font-semibold mb-3">{translations[language].addTask}</h3>
                <input type="text" placeholder={translations[language].taskTitle} value={newTaskTitle} onChange={(e) => setNewTaskTitle(e.target.value)} className="w-full p-2 border rounded mb-3" />
                <input type="date" value={newTaskDate} onChange={(e) => setNewTaskDate(e.target.value)} className="w-full p-2 border rounded mb-3" />
                <input type="time" value={newTaskTime} onChange={(e) => setNewTaskTime(e.target.value)} className="w-full p-2 border rounded mb-3" />
                <button onClick={addTask} className="w-full bg-blue-600 text-white p-2 rounded flex items-center justify-center">
                    <FaPlus className="mr-2" /> {translations[language].addTask}
                </button>
            </div>

        </div> ) : (
            <div className="flex ">
            {/* Takvim */}
            <div className={`${darkMode ? "bg-gray-700 text-gray-500" : "bg-yellow-100 text-gray-900"} p-6 w-full rounded-lg mr-6`}>
                <div className="grid grid-cols-7 gap-2 ">
                    {getWeekDays().map((day, i) => (
                        <div key={day} className="p-3 bg-white rounded-lg shadow-md w-full">
                            <h3 className="text-sm font-semibold">{dayjs(day).format("DD")} {translations[language].days[i]}</h3>  
                            <ul className="mt-1">
                                {[...(tasks.filter(task => task.date === day)), ...(meetings.filter(meeting => meeting.date === day))].map(item => (
                                    <li key={item.id} className="text-xs bg-gray-00 p-1 rounded mt-1">
                                        {item.time} - {item.title} {item.participants ? `(${item.participants})` : ""}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>

            
            {/* Toplantı Ekleme */}
            <div className={`${darkMode ? "bg-gray-700 text-gray-400" : "bg-yellow-100 text-gray-900"} w-1/4 p-6 shadow-lg rounded-lg mt-6`}>
                <h3 className="text-lg font-semibold mb-3">{translations[language].addMeeting}</h3>
                <input type="text" placeholder={translations[language].meetingTitle} value={newMeetingTitle} onChange={(e) => setNewMeetingTitle(e.target.value)} className="w-full p-2 border rounded mb-3" />
                <input type="text" placeholder={translations[language].meetingParticipants} value={newMeetingParticipants} onChange={(e) => setNewMeetingParticipants(e.target.value)} className="w-full p-2 border rounded mb-3" />
                <input type="date" value={newTaskDate} onChange={(e) => setNewTaskDate(e.target.value)} className="w-full p-2 border rounded mb-3" />
                <input type="time" value={newTaskTime} onChange={(e) => setNewTaskTime(e.target.value)} className="w-full p-2 border rounded mb-3" />
                <button onClick={addMeeting} className="w-full bg-blue-600 text-white p-2 rounded flex items-center justify-center">
                    <FaPlus className="mr-2" /> {translations[language].addMeeting}
                </button>
            </div>

        </div>
        )}
    </div>
    </div>
  );
};

export default TaskCalendar;
