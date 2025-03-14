import { useState, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const TeamMembers = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/employees")
      .then((response) => response.json())
      .then((data) => {
        setEmployees(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Veriler getirilemedi:", error);
        setError("Veriler getirilemedi.");
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-center">Yükleniyor...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  // Yönetici belirleme
  const manager = employees.find(emp => emp.role.toLowerCase() === "yönetici");
  const otherEmployees = employees.filter(emp => emp.role.toLowerCase() !== "yönetici");

  return (
    <div className="p-6 w-full">
      <h1 className="text-2xl font-bold mb-4 text-center">Takım Üyeleri</h1>

      {/* Yönetici Kartı */}
      {manager && (
        <div 
          onClick={() => navigate(`/team-members/${manager.id}`)}
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex flex-col items-center cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition"
        >
          <img src={manager.photo_url || "https://via.placeholder.com/100"} alt={manager.name} className="w-24 h-24 rounded-full mb-2" />
          <h3 className="text-lg font-semibold dark:text-white">{manager.name} {manager.surname}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-300">{manager.role}</p>
        </div>
      )}

      {/* Diğer Çalışanlar */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        {otherEmployees.map((employee) => (
          <div 
            key={employee.id} 
            onClick={() => navigate(`/team-members/${employee.id}`)}
            className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md flex flex-col items-center cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          >
            <img src={employee.photo_url || "https://via.placeholder.com/80"} alt={employee.name} className="w-20 h-20 rounded-full mb-2" />
            <h3 className="text-lg font-semibold dark:text-white">{employee.name} {employee.surname}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-300">{employee.role}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamMembers;
