import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useOutletContext } from 'react-router-dom';

const EmployeeCalendar = ({ assignedTasks, personalTasks, meetings }) => {
  const { darkMode, language } = useOutletContext();

  const translations = {
    tr: {
      task: "Görev",
      personal: "Kişisel",
      meeting: "Toplantı"
    },
    en: {
      task: "Task",
      personal: "Personal",
      meeting: "Meeting"
    }
  };

  const icons = {
    task: "💼",
    personal: "✅",
    meeting: "🗓️"
  };

  const allEvents = [
    ...assignedTasks.map(task => ({
      date: new Date(task.completed_at || task.deadline),
      title: `${translations[language].task}: ${task.title}`,
      type: "task"
    })),
    ...personalTasks.map(task => ({
      date: new Date(task.start),
      title: `${translations[language].personal}: ${task.title}`,
      type: "personal"
    })),
    ...meetings.map(m => ({
      date: new Date(m.date),
      title: `${translations[language].meeting}: ${m.title}`,
      type: "meeting"
    })),
  ];

  const tileContent = ({ date }) => {
    const dayEvents = allEvents.filter(event =>
      new Date(event.date).toDateString() === date.toDateString()
    );

    return dayEvents.length ? (
      <ul className="text-[10px] leading-tight mt-1 space-y-0.5 px-1">
        {dayEvents.map((event, idx) => (
          <li key={idx} className={
            event.type === "task"
              ? "text-blue-600"
              : event.type === "personal"
              ? "text-green-600"
              : "text-yellow-600"
          }>
            {icons[event.type]} {event.title}
          </li>
        ))}
      </ul>
    ) : null;
  };

  return (
    <div className={`p-6 rounded-2xl shadow-md w-full h-full min-h-[550px] ${darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"}`}>
      <Calendar
        tileContent={tileContent}
        locale={language === "tr" ? "tr-TR" : "en-US"}
        className={`react-calendar w-full max-w-none text-sm ${darkMode ? "dark" : ""}`}
      />

    </div>
  );
};

export default EmployeeCalendar;
