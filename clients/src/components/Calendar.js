import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { FaChevronLeft, FaChevronRight, FaPlus } from "react-icons/fa";
import dayjs from "dayjs";
import updateLocale from "dayjs/plugin/updateLocale";
import weekday from "dayjs/plugin/weekday";
import isBetween from "dayjs/plugin/isBetween";
import utc from "dayjs/plugin/utc";

dayjs.extend(updateLocale);
dayjs.extend(weekday);
dayjs.extend(utc);
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
  const [meetings, setMeetings] = useState([]);       // UI'da gösterilecek tekil toplantılar
  const [rawMeetings, setRawMeetings] = useState([]); // Çakışma kontrolü için tüm satırlar
  const [errorMessage, setErrorMessage] = useState("");
  const userEmail = localStorage.getItem("userEmail");
  const [teamMembers, setTeamMembers] = useState([]);
  const [selectedParticipants, setSelectedParticipants] = useState([]);
  const startOfMonth = dayjs().year(selectedYear).month(selectedMonth).startOf('month');
  const endOfMonth = dayjs().year(selectedYear).month(selectedMonth).endOf('month');
  const startDay = startOfMonth.day(); // Haftanın kaçıncı günü (0 = Sunday)
  const daysInMonth = endOfMonth.date(); // Ayın toplam günü
  const calendarDays = [];
  const userDepartment = localStorage.getItem("userDepartment");
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [popoverPos, setPopoverPos] = useState({ x: 0, y: 0 });


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

const fetchMeetings = async () => {
  try {
    const res = await fetch(`http://localhost:5000/meetings/all`);
    const data = await res.json();

    setRawMeetings(data); // çakışma için

    // Genel takvim için benzersiz toplantılar
    const uniqueMeetingsMap = new Map();
    data.forEach(m => {
      if (!uniqueMeetingsMap.has(m.meeting_id)) {
        uniqueMeetingsMap.set(m.meeting_id, {
          id: m.meeting_id,
          date: new Date(m.start_time).toISOString().slice(0, 10),
          time: `${new Date(m.start_time).toISOString().slice(11, 16)} - ${new Date(m.end_time).toISOString().slice(11, 16)}`,
          title: m.title,
          participants: data
        .filter(x => x.meeting_id === m.meeting_id)
        .map(x => ({ name: x.participant_name || `Kişi ${x.participant_id}` }))
        });
      }
    });
    setMeetings(Array.from(uniqueMeetingsMap.values()));

    const groupedMeetings = meetings.reduce((acc, meeting) => {
  const id = meeting.meeting_id;
  if (!acc[id]) {
    acc[id] = {
      ...meeting,
      participants: [meeting.participant_name],
    };
  } else {
    acc[id].participants.push(meeting.participant_name);
  }
  return acc;
}, {});

   const uniqueMeetings = Object.values(groupedMeetings);
    const employeeId = parseInt(localStorage.getItem("employeeId"), 10);
    const userEmail = localStorage.getItem("userEmail");

    // 1️⃣ Bireysel toplantılar
   const seen = new Set();
  const personalMeetings = data.filter(m => {
  const isInvolved = (
    m.participant_id === employeeId ||
    m.organizer_id === employeeId ||
    m.host_id === employeeId
  );

  if (!isInvolved) return false;

  if (seen.has(m.meeting_id)) return false;

  seen.add(m.meeting_id);
  return true;
});

   
    // 2️⃣ Kendi görevlerini getir
    const taskRes = await fetch(`http://localhost:5000/personal-tasks/${employeeId}`);
    const taskData = await taskRes.json();
    const personalTasks = taskData.map(t => ({
      id: t.id,
      date: t.start_time.split("T")[0],
      time: `${t.start_time.split("T")[1].slice(0,5)} - ${t.end_time.split("T")[1].slice(0,5)}`,
      title: t.title,
      owner: userEmail
    }));

const personalMeetingTasks = personalMeetings.map(m => ({
  id: m.id,
  date: new Date(m.start_time).toISOString().slice(0, 10),
  time: `${new Date(m.start_time).toISOString().slice(11, 16)} - ${new Date(m.end_time).toISOString().slice(11, 16)}`,
  title: m.title,
  owner: userEmail
}));

setTasks([...personalMeetingTasks, ...personalTasks]);

  } catch (err) {
    console.error("Toplantı veya görev verisi alınamadı:", err);
  }
};


  // addMeeting çakışma kontrolüyle güncellenmiş hali
  dayjs.extend(isBetween); // dayjs isBetween plugini lazımsa
  
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
 
      fetchMeetings();  // toplantı eklendikten sonra yenile
    
    
    if (userEmail) fetchTeamMembers();
  },  [userEmail, viewMode]);

    useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get("tab");
    if (tab === "team" || tab === "personal") {
      setViewMode(tab);
    }
  }, []);
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

  const addTask = async () => {
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

  const employeeId = localStorage.getItem("employeeId");
  if (!employeeId) return;

  try {
    const res = await fetch("http://localhost:5000/personal-tasks/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        employeeId,
        title: newTaskTitle,
        startTime: `${newTaskDate}T${startTime}`,
        endTime: `${newTaskDate}T${endTime}`
      })
    });

    if (!res.ok) throw new Error("Görev eklenemedi");

    // ✅ Yeniden görevleri ve toplantıları çek
    await fetchMeetings();

    setNewTaskTitle("");
    setErrorMessage("");
  } catch (err) {
    console.error("Görev ekleme hatası:", err);
    setErrorMessage(language === "tr" ? "Görev eklenemedi" : "Task could not be added");
  }
};

  
const addMeeting = async () => {
  // 1️⃣ Alanları kontrol et
  if (!newMeetingTitle.trim() || !startTime || !endTime || !newTaskDate || selectedParticipants.length === 0) {
    setErrorMessage(language === 'tr'
      ? "Tüm alanlar gerekli."
      : "All fields are required."
    );
    return;
  }
  if (startTime >= endTime) {
    setErrorMessage(language === 'tr'
      ? "Başlangıç saati, bitiş saatinden önce olmalı."
      : "Start time must be before end time."
    );
    return;
  }

  // 2️⃣ Katılımcı ID'leri (host + seçilenler)
  const hostId = parseInt(localStorage.getItem("employeeId"), 10);
  const participantIds = teamMembers
    .filter(m => selectedParticipants.includes(m.name))
    .map(m => m.employee_id);
  participantIds.push(hostId);

  // 3️⃣ DB’den en güncel toplantıları al (rawMeetings state’ine)
  await fetchMeetings();

  // 4️⃣ Çakışma kontrolü (frontend’de ön gösterim için)
  const newStart = dayjs(`${newTaskDate}T${startTime}`);
  const newEnd   = dayjs(`${newTaskDate}T${endTime}`);
  // const conflicts = rawMeetings.filter(m => {
  //   const mStart = dayjs(m.start_time);
  //   const mEnd   = dayjs(m.end_time);
  //   return mStart.isSame(newStart, "day")
  //       && newStart.isBefore(mEnd)
  //       && newEnd.isAfter(mStart)
  //       && participantIds.includes(m.participant_id);
  // });
  // if (conflicts.length) {
  //   setErrorMessage(language === 'tr'
  //     ? "Katılımcılardan biri o saatte başka bir toplantıda."
  //     : "One of the participants already has a meeting at this time."
  //   );
  //   return;
  // }

  // 5️⃣ Backend’e POST
  try {
    const res = await fetch("http://localhost:5000/meetings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title:           newMeetingTitle.trim(),
        date:            newTaskDate,
        start_time:      `${newTaskDate}T${startTime}`,
        end_time:        `${newTaskDate}T${endTime}`,
        team_name:       userDepartment,
        organizer_id:    hostId,
        host_id: hostId, 
        participant_ids: participantIds.filter(id => id !== hostId)
      })
    });

    // 🚨 Çakışma cevabı 400 ile gelirse:
    if (res.status === 400) {
      return setErrorMessage(language === 'tr'
        ? "Katılımcılardan biri o saatte başka bir toplantıda."
        : "One of the participants already has a meeting at this time."
      );
    }

    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.message || "Meeting creation failed.");
    }

    // ✅ Başarılıysa tekrar DB’den çek ve state’i güncelle
    await fetchMeetings();
    setMeetings(rawMeetings.map(m => ({
      id:    m.meeting_id,
      date:  m.date,
      time:  `${m.start_time.slice(11,16)} - ${m.end_time.slice(11,16)}`,
      title: m.title
    })));

    // Temizlik
    setNewMeetingTitle("");
    setSelectedParticipants([]);
    setErrorMessage("");

  } catch (err) {
    console.error("Veri kaydedilemedi:", err);
    // Genel hata mesajı
    setErrorMessage(language === 'tr'
      ? "Toplantı kaydedilemedi. Lütfen tekrar deneyin."
      : "Couldn’t save the meeting. Please try again."
    );
  }
  window.location.reload(); 

};

  
  return (
    <div className={`w-full pt-16 px-4 md:px-8 lg:px-16 ${darkMode ? "bg-[#0f172a] text-white" : "bg-white text-gray-900"}`}>
      <div className="flex justify-center mb-4">
        <button
          className={`px-6 py-2 rounded-l-lg ${viewMode === "personal" ? "bg-blue-600 text-white" : "bg-gray-300"}`}
          onClick={() => window.location.href = "/calendar?tab=personal"}
        >
          {translations[language].personal}
        </button>
        <button
          className={`px-6 py-2 rounded-r-lg ${viewMode === "team" ? "bg-blue-600 text-white" : "bg-gray-300"}`}
          onClick={() => window.location.href = "/calendar?tab=team"}
        >
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
                        <li
                          key={idx}
                          className="bg-gray-100 p-1 mt-1 rounded cursor-pointer hover:bg-gray-200"
                          onClick={(e) => {
                            const rect = e.target.getBoundingClientRect();
                            setPopoverPos({ x: rect.left + window.scrollX, y: rect.bottom + window.scrollY });
                            setSelectedMeeting(item);
                          }}
                        >
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

          {selectedMeeting && (
            <div
              style={{
                position: "absolute",
                top: popoverPos.y + 5,
                left: popoverPos.x,
                background: "white",
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "10px",
                zIndex: 1000,
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                minWidth: "200px"
              }}
              onClick={() => setSelectedMeeting(null)}
            >
              <h4 className="font-bold mb-1 text-sm">{selectedMeeting.title}</h4>
              <p className="text-xs text-gray-500 mb-1">
                {selectedMeeting.time} ({selectedMeeting.start_time?.slice(11, 16)} - {selectedMeeting.end_time?.slice(11, 16)})
              </p>
              <p className="text-sm font-medium">Katılımcılar:</p>
              <ul className="list-disc pl-5 text-sm">
                {Array.isArray(selectedMeeting.participants) && selectedMeeting.participants.length > 0 ? (
                  selectedMeeting.participants.map((p, i) => (
                    <li key={i}>{p.name || p}</li>
                  ))
                ) : (
                  <li className="italic text-gray-400">Bilinmiyor</li>
                )}
              </ul>
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
              {/* Sağ alt köşedeki AI simgesi */}
              <div
                className="fixed bottom-6 right-6 z-50 cursor-pointer"
                onClick={() => alert("AI Smart Meeting Suggestion henüz aktif değil.")}
              >
                <img
                  src={require("../assets/smartMeeting.png")}
                  alt="AI Prioritize"
                  className="w-20 h-20 hover:scale-105 transition-transform duration-200"
                />
              </div>
        </div>
      </div>
    </div>
  );
};
export default TaskCalendar;
