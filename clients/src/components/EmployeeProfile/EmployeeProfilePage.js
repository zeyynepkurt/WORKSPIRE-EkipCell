import React, { useEffect, useState } from 'react';
import axios from 'axios';
import EmployeeInfoCard from './EmployeeInfoCard';
import ScoreDisplay from './ScoreDisplay';
import EmployeeCalendar from './EmployeeCalendar';
import { useOutletContext } from "react-router-dom";

const EmployeeProfilePage = ({ employeeId }) => {
  const { darkMode, language } = useOutletContext();
  const [data, setData] = useState(null);

  const translations = {
    tr: { calendar: "Takvim", score: "Puan", phone: "Telefon" },
    en: { calendar: "Calendar", score: "Score", phone: "Phone" },
  };

  useEffect(() => {
    axios.get(`/api/employees/${employeeId}/calendar`)
      .then(res => setData(res.data))
      .catch(err => console.error("Takvim API hatası:", err));
  }, [employeeId]);

  if (!data) return (
    <div className={`p-6 min-h-screen flex items-center justify-center ${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}>
      <p className="text-lg">Yükleniyor...</p>
    </div>
  );

  return (
    <div className={`flex min-h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>
      {/* Sol Panel */}
      <div className={`w-full md:max-w-[320px] p-6 flex flex-col items-center shadow-lg ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>
        <EmployeeInfoCard employee={data.employee} />
        <div className="mt-6 w-full">
          <ScoreDisplay score={data.employee.score} />
        </div>
      </div>

      {/* Sağ Panel */}
      <div className={`flex-grow p-8 ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>
        <div className={`${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"} rounded-2xl shadow p-6 w-full h-full min-h-[600px]`}>
          <h2 className={`${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"} text-2xl font-bold mb-6`}>{translations[language].calendar}</h2>
          <EmployeeCalendar
            assignedTasks={data.assigned_tasks}
            personalTasks={data.personal_tasks}
            meetings={data.meetings}
          />
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfilePage;
