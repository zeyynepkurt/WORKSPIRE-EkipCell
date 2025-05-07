import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { FaChevronLeft, FaChevronRight, FaPlus } from "react-icons/fa";
import dayjs from "dayjs";
import updateLocale from "dayjs/plugin/updateLocale";
import weekday from "dayjs/plugin/weekday";

dayjs.extend(updateLocale);
dayjs.extend(weekday);

dayjs.updateLocale('en', {
  weekStart: 1  // Pazartesi
});


const TaskCalendar = () => {
  const { darkMode, language } = useOutletContext();
  const [viewMode, setViewMode] = useState("personal");
  const [selectedMonth, setSelectedMonth] = useState(dayjs().month());
  const [selectedYear, setSelectedYear] = useState(dayjs().year());
  const [currentWeek, setCurrentWeek] = useState(dayjs().year(selectedYear).month(selectedMonth).startOf("week"));
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newMeetingTitle, setNewMeetingTitle] = useState("");
  const [newMeetingParticipants, setNewMeetingParticipants] = useState("");
  const [newTaskDate, setNewTaskDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [startTime, setStartTime] = useState("12:00");
  const [endTime, setEndTime] = useState("13:00");
  const [tasks, setTasks] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const userEmail = localStorage.getItem("userEmail");
  const [teamMembers, setTeamMembers] = useState([]);
  const [selectedParticipants, setSelectedParticipants] = useState([]);
  const startOfMonth = dayjs().year(selectedYear).month(selectedMonth).startOf('month');
  const endOfMonth = dayjs().year(selectedYear).month(selectedMonth).endOf('month');
  const startDay = startOfMonth.day(); // Haftanın kaçıncı günü (0 = Sunday)
  const daysInMonth = endOfMonth.date(); // Ayın toplam günü
  const calendarDays = [];
  for (let i = 0; i < startDay; i++) calendarDays.push(null); // Ay öncesi boş hücreler
  for (let i = 1; i <= daysInMonth; i++) calendarDays.push(dayjs(startOfMonth).date(i).format("YYYY-MM-DD"));

  const translations = {
    tr: {
      calendar: "Genel Görevli Takvim",
      addTask: "Görev Ekle",
      addMeeting: "Toplantı Ekle",
      taskTitle: "Görev Konusu",
      meetingTitle: "Toplantı Konusu",
      meetingParticipants: "Katılımcılar",
      taskDate: "Gün Seç",
      startTime: "Başlangıç Saati",
      endTime: "Bitiş Saati",
      invalidTime: "Başlangıç saati, bitiş saatinden önce olmalı!",
      conflict: "Bu saat aralığında zaten bir görev var!",
      personal: "Bireysel Takvim",
      team: "Ekip Takvimi",
      days: ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"],
      months: ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"]
    },
    en: {
      calendar: "General Task Calendar",
      addTask: "Add Task",
      addMeeting: "Add Meeting",
      taskTitle: "Task Title",
      meetingTitle: "Meeting Title",
      meetingParticipants: "Participants",
      taskDate: "Select Date",
      startTime: "Start Time",
      endTime: "End Time",
      invalidTime: "Start time must be before end time!",
      conflict: "There's already a task in this time range!",
      personal: "Personal Calendar",
      team: "Team Calendar",
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    }
  };

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const res = await fetch(`http://localhost:5000/employees/${userEmail}`);
        const data = await res.json();
        setTeamMembers(data); // backend artık giriş yapan kişiyi zaten dışladı
      } catch (err) {
        console.error("Ekip üyeleri alınamadı:", err);
      }
    };
    const fetchMeetings = async () => {
      try {
        const res = await fetch("http://localhost:5000/team_calendar_it1"); // departman adını uygun şekilde koy
        const data = await res.json();
        setMeetings(data);
      } catch (err) {
        console.error("Toplantılar alınamadı:", err);
      }
    };
    if (viewMode === "team") fetchMeetings();
    if (userEmail) fetchTeamMembers();
  }, [userEmail],[viewMode]);

  const previousMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };

  const nextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };

  const generateCalendar = () => {
    const firstDayOfMonth = dayjs().year(selectedYear).month(selectedMonth).startOf("month");
    const daysInMonth = firstDayOfMonth.daysInMonth();
  
    // Haftanın ilk günü Pazartesi olarak ayarlanmalı
    let startDay = firstDayOfMonth.day(); // Sunday = 0, Monday = 1 ...
    if (startDay === 0) startDay = 7;     // Pazar'ı 7 olarak al
  
    const days = [];
    for (let i = 1; i < startDay; i++) days.push(null); // Boş hücreler
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(dayjs().year(selectedYear).month(selectedMonth).date(i).format("YYYY-MM-DD"));
    }
  
    return days;
  };

  const addTask = () => {
    if (newTaskTitle.trim() === "") {
      const msg = language === "tr"
        ? "Görev konusu boş olamaz!"
        : "Task title cannot be empty!";
      setErrorMessage(msg);
      return;
    }
  
    if (startTime >= endTime) {
      const msg = language === "tr"
        ? "Başlangıç saati, bitiş saatinden önce olmalı!"
        : "Start time must be before end time!";
      setErrorMessage(msg);
      return;
    }
  
    const sameDayTasks = tasks.filter(t => t.date === newTaskDate && t.owner === userEmail);
    const newStart = dayjs(`${newTaskDate}T${startTime}`);
    const newEnd = dayjs(`${newTaskDate}T${endTime}`);
  
    const hasConflict = sameDayTasks.some(t => {
      const [tStartStr, tEndStr] = t.time.split(" - ");
      const tStart = dayjs(`${t.date}T${tStartStr}`);
      const tEnd = dayjs(`${t.date}T${tEndStr}`);
      return newStart.isBefore(tEnd) && newEnd.isAfter(tStart);
    });
  
    if (hasConflict) {
      const msg = language === "tr"
        ? "Bu saat aralığında zaten bir görev var!"
        : "There's already a task in this time range!";
      setErrorMessage(msg);
      return;
    }
  
    const newTask = {
      id: tasks.length + 1,
      date: newTaskDate,
      time: `${startTime} - ${endTime}`,
      title: newTaskTitle,
      owner: userEmail
    };
    setTasks([...tasks, newTask]);
    setNewTaskTitle("");
    setErrorMessage("");
  };
  
  const addMeeting = () => {
    if (
      newMeetingTitle.trim() === "" ||
      selectedParticipants.length === 0 ||
      !startTime ||
      !endTime ||
      !newTaskDate
    ) {
      setErrorMessage(language === "tr"
        ? "Lütfen tüm alanları doldurun!"
        : "Please fill in all fields!");
      return;
    }
  
    if (startTime >= endTime) {
      setErrorMessage(language === "tr"
        ? "Başlangıç saati, bitiş saatinden önce olmalı!"
        : "Start time must be before end time!");
      return;
    }
  
    const newStart = dayjs(`${newTaskDate}T${startTime}`);
    const newEnd = dayjs(`${newTaskDate}T${endTime}`);
    const sameDayMeetings = meetings.filter(m => m.date === newTaskDate);
    const hasConflict = sameDayMeetings.some(m => {
      const [mStartStr, mEndStr] = m.time.split(" - ");
      const mStart = dayjs(`${m.date}T${mStartStr}`);
      const mEnd = dayjs(`${m.date}T${mEndStr}`);
      return newStart.isBefore(mEnd) && newEnd.isAfter(mStart);
    });
  
    if (hasConflict) {
      setErrorMessage(language === "tr"
        ? "Bu saat araliginda zaten bir toplanti var!"
        : "There's already a meeting in this time range!");
      return;
    }
  
    const newMeeting = {
      id: meetings.length + 1,
      date: newTaskDate,
      time: `${startTime} - ${endTime}`,
      title: newMeetingTitle.trim(),
      participants: selectedParticipants.join(", ")
    };
  
    // Ekip takvimine ekle
setMeetings(prev => [...prev, newMeeting]);

// ✅ Bireysel takvimler için: katılımcılar + giriş yapan kişi
  const participantsIncludingSelf = [...selectedParticipants];

  // Giriş yapan kişi name listesinde olmayabilir, sadece email ile ekle
  participantsIncludingSelf.forEach((participantName) => {
    const member = teamMembers.find(m => m.name === participantName);
    if (member) {
      setTasks(prev => [...prev, {
        id: prev.length + 1,
        date: newTaskDate,
        time: `${startTime} - ${endTime}`,
        title: newMeetingTitle.trim(),
        owner: member.email || member.employee_id || member.name
      }]);
    }
  });

  // Giriş yapan kişiyi ayrıca bireysel takvime ekle
  setTasks(prev => [...prev, {
    id: prev.length + 1,
    date: newTaskDate,
    time: `${startTime} - ${endTime}`,
    title: newMeetingTitle.trim(),
    owner: userEmail
  }]);

  
    setNewMeetingTitle("");
    setSelectedParticipants([]);
    setNewMeetingParticipants("");
    setErrorMessage("");
  };
  
  return (
    <div className={`w-full pt-16 px-4 md:px-8 lg:px-16 ${darkMode ? "bg-[#0f172a] text-white" : "bg-white text-gray-900"}`}>
      <div className="flex justify-center mb-4">
        <button className={`px-6 py-2 rounded-l-lg ${viewMode === "personal" ? "bg-blue-600 text-white" : "bg-gray-300"}`} onClick={() => setViewMode("personal")}>
          {translations[language].personal}
        </button>
        <button className={`px-6 py-2 rounded-r-lg ${viewMode === "team" ? "bg-blue-600 text-white" : "bg-gray-300"}`} onClick={() => setViewMode("team")}>
          {translations[language].team}
        </button>
      </div>

      <h1 className="text-2xl font-bold mb-4 text-center">{translations[language].calendar}</h1>

      <div className="flex justify-center items-center mb-6 gap-3">
        <button onClick={previousMonth} className="p-2 rounded bg-blue-600 text-white"><FaChevronLeft /></button>
        <span className="text-lg font-semibold">{translations[language].months[selectedMonth]} {selectedYear}</span>
        <button onClick={nextMonth} className="p-2 rounded bg-blue-600 text-white"><FaChevronRight /></button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="grid grid-cols-7 gap-1 w-full">
          {translations[language].days.map((d, i) => (
            <div key={i} className="font-bold text-center">{d}</div>
          ))}
          {generateCalendar().map((date, i) => (
            <div key={i} className="h-32 border p-2 text-sm bg-white">
              {date && (
                <>
                  <div className="font-bold">{dayjs(date).date()}</div>
                  <ul className="text-xs mt-1">
                    {[...(viewMode === "personal"
                      ? tasks.filter(t => t.date === date && t.owner === userEmail)
                      : meetings.filter(m => m.date === date))]
                      .sort((a, b) => a.time.localeCompare(b.time))
                      .map((item, idx) => (
                        <li key={idx} className="bg-gray-100 p-1 mt-1 rounded">
                          {item.time} - {item.title}
                        </li>
                    ))}
                  </ul>

                </>
              )}
            </div>
          ))}
        </div>

        {/* Sağdaki ekleme formu */}
        <div className="w-full lg:w-1/4 p-4 bg-yellow-100 rounded shadow">
          <h2 className="text-lg font-bold mb-3">{viewMode === "personal" ? translations[language].addTask : translations[language].addMeeting}</h2>
          <input className="w-full p-2 mb-2 border text-black rounded" type="text"
            placeholder={viewMode === "personal" ? translations[language].taskTitle : translations[language].meetingTitle}
            value={viewMode === "personal" ? newTaskTitle : newMeetingTitle}
            onChange={e => viewMode === "personal" ? setNewTaskTitle(e.target.value) : setNewMeetingTitle(e.target.value)} />
          {viewMode === "team" && (
            <div className="mb-2">
              {teamMembers.map((m) => (
                <label key={m.employee_id} className="block text-black">
                  <input
                    type="checkbox"
                    value={m.name}
                    checked={selectedParticipants.includes(m.name)}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (e.target.checked) {
                        setSelectedParticipants([...selectedParticipants, value]);
                      } else {
                        setSelectedParticipants(selectedParticipants.filter(p => p !== value));
                      }
                    }}
                    className="mr-2"
                  />
                  {m.name}
                </label>
              ))}
            </div>
          )}
        
          <input className="w-full p-2 mb-2 border text-black rounded" type="date" value={newTaskDate} onChange={(e) => setNewTaskDate(e.target.value)} />
          <input className="w-full p-2 mb-2 border text-black rounded" type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
          <input className="w-full p-2 mb-2 border text-black rounded" type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
          {errorMessage && (
            <div className="bg-red-100 text-red-700 p-2 mb-2 rounded text-sm">
              {errorMessage}
            </div>
          )}
          <button className="w-full bg-blue-600 text-white p-2 rounded flex justify-center items-center"
            onClick={viewMode === "personal" ? addTask : addMeeting}>
            <FaPlus className="mr-2" />
            {viewMode === "personal" ? translations[language].addTask : translations[language].addMeeting}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCalendar;
