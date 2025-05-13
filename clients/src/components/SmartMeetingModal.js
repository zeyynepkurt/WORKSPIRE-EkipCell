import React, { useEffect, useState } from "react";
import axios from "axios";
import { useOutletContext } from "react-router-dom";

function SmartMeetingModal({ onClose, rawMeetings }) {
  const [employees, setEmployees] = useState([]);
  const [selectedParticipants, setSelectedParticipants] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [organizer, setOrganizer] = useState(null);

  const { language, darkMode } = useOutletContext();
  const userEmail = localStorage.getItem("userEmail");

  const translations = {
    tr: {
      title: "Akıllı Toplantı",
      noParticipants: "Katılımcı bulunamadı.",
      getSuggestions: "Önerileri Getir",
      suggestions: "Önerilen Zamanlar",
      close: "Kapat",
    },
    en: {
      title: "Smart Meeting",
      noParticipants: "No participants found.",
      getSuggestions: "Get Suggestions",
      suggestions: "Suggested Slots",
      close: "Close",
    },
  };

  useEffect(() => {
  if (userEmail) {
    // 1. Organizer'ı al
    axios
      .get(`http://localhost:5000/employees/email/${userEmail}`)
      .then((res) => {
        const currentUser = res.data;
        setOrganizer(currentUser.employee_id);

        // Organizer'ı seçili katılımcılar listesine ekle
        setSelectedParticipants((prev) =>
          prev.includes(currentUser.employee_id)
            ? prev
            : [...prev, currentUser.employee_id]
        );

        // 2. Aynı takımdaki çalışanları getir
        axios
          .get(`http://localhost:5000/employees/team/${currentUser.department}`)
          .then((teamRes) => {
            setEmployees(teamRes.data);
          })
          .catch((err) => console.error("Takım çalışanları alınamadı:", err));
      })
      .catch((err) => console.error("Organizer alınamadı:", err));
  }
}, [userEmail]);




const handleGetSuggestions = async () => {
  try {
    const formattedMeetings = {};

    // 💡 rawMeetings'i katılımcılara göre grupla
    rawMeetings.forEach((m) => {
      const pid = m.participant_id;
      if (!formattedMeetings[pid]) formattedMeetings[pid] = [];
      formattedMeetings[pid].push({
        start_time: m.start_time,
        end_time: m.end_time,
      });
    });

    // ✅ Organizer meeting’leri rawMeetings içinde varsa ekle
    const organizerMeetings = rawMeetings.filter(
      (m) => m.participant_id === organizer
    );
    if (organizerMeetings.length > 0 && !formattedMeetings[organizer]) {
      formattedMeetings[organizer] = organizerMeetings.map((m) => ({
        start_time: m.start_time,
        end_time: m.end_time,
      }));
    }

    // ✅ Organizer'ı mutlaka katılımcılara ekle
    const allParticipants = selectedParticipants.includes(organizer)
      ? selectedParticipants
      : [...selectedParticipants, organizer];

    console.log("📤 İstek gönderiliyor:", {
      participants: allParticipants,
      meetings: formattedMeetings,
    });

    const response = await axios.post("http://localhost:5001/api/meeting-suggestions/suggest", {
      participants: allParticipants,
      duration: 60,
      meetings: formattedMeetings,
    });

    setSuggestions(response.data);
  } catch (error) {
    console.error("Smart Suggestion Error:", error);
  }
};

  const toggleParticipant = (id) => {
    setSelectedParticipants((prev) =>
      prev.includes(id)
        ? prev.filter((pid) => pid !== id)
        : [...prev, id]
    );
  };

  return (
    <div className={`fixed bottom-24 right-6 rounded-2xl shadow-2xl p-4 w-80 z-50 border transition-all duration-300 ${
      darkMode ? "bg-gray-900 text-white border-gray-700" : "bg-white text-gray-900 border-gray-200"
    }`}>
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold">
          {translations[language].title}
        </h2>
        <button
          onClick={onClose}
          className="text-xl font-bold hover:text-red-500"
        >
          ×
        </button>
      </div>

      <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
        {employees.length === 0 ? (
          <p className="text-sm text-gray-400">
            {translations[language].noParticipants}
          </p>
        ) : (
          employees.map((emp) => (
            <label key={emp.employee_id} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={
                  selectedParticipants.includes(emp.employee_id) ||
                  emp.employee_id === organizer
                }
                disabled={emp.employee_id === organizer}
                onChange={() => toggleParticipant(emp.employee_id)}
              />
              {emp.name}
            </label>
          ))
        )}
      </div>

      <button
        onClick={handleGetSuggestions}
        className={`mt-4 w-full py-2 rounded font-medium ${
          darkMode
            ? "bg-blue-700 hover:bg-blue-600 text-white"
            : "bg-blue-600 hover:bg-blue-700 text-white"
        }`}
      >
        {translations[language].getSuggestions}
      </button>

      {suggestions.length > 0 && (
        <div className="mt-4 space-y-2 text-sm">
          <h4 className="font-semibold">
            {translations[language].suggestions}:
          </h4>
          {suggestions.map((s, i) => (
            <div
              key={i}
              className={`p-2 rounded ${
                darkMode ? "bg-gray-800 text-white" : "bg-gray-100"
              }`}
            >
              <strong>{new Date(s.start).toLocaleString()}</strong> –{" "}
              <strong>{new Date(s.end).toLocaleTimeString()}</strong>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SmartMeetingModal;
