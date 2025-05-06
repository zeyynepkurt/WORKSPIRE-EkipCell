import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useOutletContext } from "react-router-dom";

const Scoreboard = () => {
  const [scores, setScores] = useState([]);
  const [view, setView] = useState('company');
  const { darkMode, language } = useOutletContext();

  const loggedInUserId = parseInt(localStorage.getItem("employeeId"), 10);
  const userEmail       = localStorage.getItem("userEmail");
  const managerId       = localStorage.getItem("managerId");

  // Yalnızca null/undefined değilse "Ekip İçi" butonunu göster
  const canViewTeam = managerId != null
                   && managerId !== "null"
                   && managerId !== "undefined";

  const fetchScores = async () => {
    try {
      if (view === 'company') {
        // Şirket geneli
        const res = await axios.get('http://localhost:5000/scores/company');
        setScores(res.data);

      } else if (view === 'team' && canViewTeam) {
        // Ekip içi: önce aynı departmandaki çalışanları çek
        const empRes = await axios.get(`http://localhost:5000/employees/${userEmail}`);
        const deptEmployees = Array.isArray(empRes.data) ? empRes.data : [];

        const deptIds = deptEmployees.map(emp => emp.employee_id);

        // Sonra tüm skorları alıp filtrele
        const scoreRes = await axios.get('http://localhost:5000/scores/company');
        const deptScores = scoreRes.data.filter(score =>
          deptIds.includes(score.employee_id)
        );

        setScores(deptScores);
      } else {
        // "team" görünüp dahi buton gizliyse boş liste
        setScores([]);
      }
    } catch (error) {
      console.error('Error fetching scores:', error);
    }
  };

  useEffect(() => {
    fetchScores();
  }, [view]);

  const translations = {
    tr: { company: "Şirket Geneli", team: "Ekip İçi" },
    en: { company: "Company-wide",  team: "Team"    }
  };

  return (
    <div className={`w-full p-6 min-h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}>
      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={() => setView('company')}
          className={`px-4 py-2 rounded-full ${view === 'company' ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-700'}`}
        >
          {translations[language].company}
        </button>

        {canViewTeam && (
          <button
            onClick={() => setView('team')}
            className={`px-4 py-2 rounded-full ${view === 'team' ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-700'}`}
          >
            {translations[language].team}
          </button>
        )}
      </div>

      {/* İlk üç */}
      {scores.length > 0 && (
        <div className="flex justify-center items-end mb-10 gap-4">
          {[1, 0, 2].map(i =>
            scores[i] ? (
              <div
                key={scores[i].employee_id}
                className={`text-center ${i === 0 ? "order-2" : i === 1 ? "order-1" : "order-3"}`}
              >
                <img
                  src={scores[i].photo_url}
                  alt={scores[i].name}
                  className={`mx-auto object-cover rounded-full border-4 ${i === 0 ? 'w-28 h-28 border-yellow-400' : 'w-20 h-20 border-gray-300'}`}
                />
                <h3 className="mt-2 font-semibold">{scores[i].name}</h3>
                <p className="font-bold">{scores[i].total_score}</p>
              </div>
            ) : null
          )}
        </div>
      )}

      {/* Tam liste */}
      <table className="mx-auto w-full max-w-xl rounded-lg overflow-hidden shadow-lg">
        <tbody>
          {scores.map((score, idx) => (
            <tr
              key={score.employee_id}
              className={`border-b ${darkMode ? "border-gray-700" : "border-gray-200"} ${
                score.employee_id === loggedInUserId
                  ? "bg-yellow-400"
                  : darkMode
                    ? "bg-gray-800 hover:bg-gray-700"
                    : "bg-gray-100 hover:bg-gray-200"
              } transition duration-300`}
            >
              <td className="px-4 py-2 font-semibold">{idx + 1}</td>
              <td className="px-4 py-2 flex items-center gap-3">
                <img src={score.photo_url} className="w-10 h-10 rounded-full object-cover" />
                {score.name}
              </td>
              <td className="px-4 py-2 font-semibold text-right">{score.total_score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Scoreboard;
