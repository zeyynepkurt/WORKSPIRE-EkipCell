import React from 'react';
import { useOutletContext } from 'react-router-dom';

const EmployeeInfoCard = ({ employee }) => {
  const { darkMode, language } = useOutletContext();

  const translations = {
    tr: {
      department: "Departman",
      phone: "Telefon"
    },
    en: {
      department: "Department",
      phone: "Phone"
    }
  };

  return (
    <div className={`flex flex-col items-center text-center w-full px-4 py-6 rounded-2xl shadow-md ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
      <img
        src={employee.photo_url}
        alt={employee.name}
        className="w-36 h-36 rounded-full object-cover shadow-lg mb-4 border-4 border-white dark:border-gray-700"
      />
      <h2 className="text-2xl font-bold mb-1">{employee.name}</h2>
      <p className="text-sm text-gray-500 dark:text-gray-300">{translations[language].department}: {employee.department}</p>
      <p className="mt-2 text-pink-500 font-medium">📞 {translations[language].phone}: {employee.phone}</p>
    </div>
  );
};

export default EmployeeInfoCard;
