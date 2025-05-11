import React from 'react';
import { useOutletContext } from "react-router-dom";

const ScoreDisplay = ({ score }) => {
  const { darkMode, language } = useOutletContext();

  const translations = {
    tr: { score: "Puan" },
    en: { score: "Score" },
  };

  return (
    <div
      className={`font-bold text-center rounded-xl py-4 px-6 shadow w-full
        ${darkMode ? "bg-yellow-300/10 text-yellow-300 border border-yellow-300" : "bg-yellow-200 text-yellow-900"}`}
    >
      <div className="text-sm">{translations[language].score}</div>
      <div className="text-2xl">{score}</div>
    </div>
  );
};

export default ScoreDisplay;
