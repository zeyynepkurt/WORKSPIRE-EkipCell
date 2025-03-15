import { useState, useEffect } from "react";
import { FaUserCircle, FaPhone, FaBars, FaBell, FaEnvelope, FaSun, FaMoon, FaTimes, FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";

const TeamMembers = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("tr");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const loggedInUserEmail = localStorage.getItem("userEmail");
  const loggedInUserDepartment = localStorage.getItem("userDepartment");

  useEffect(() => {
    if (!loggedInUserEmail) {
      setError("Giriş yapan kullanıcı bilgisi bulunamadı.");
      setLoading(false);
      return;
    }

    fetch(`http://localhost:5000/employees/${loggedInUserEmail}`)
      .then((response) => response.json())
      .then((data) => {
        console.log("API'den gelen veri:", data);
        if (Array.isArray(data)) {
          setEmployees(data);
          setFilteredEmployees(data); // Arama için kopyasını oluştur
        } else {
          setEmployees([]);
          setFilteredEmployees([]);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Veriler getirilemedi:", error);
        setError("Veriler getirilemedi.");
        setLoading(false);
      });
  }, []);

  // Arama işlemi
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredEmployees(employees);
    } else {
      const filtered = employees.filter(emp =>
        emp.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredEmployees(filtered);
    }
  }, [searchQuery, employees]);

  if (loading) return <p className="text-center">Yükleniyor...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  const manager = filteredEmployees.find(emp => emp.manager_id === 1 && emp.department === loggedInUserDepartment);
  const otherEmployees = filteredEmployees.filter(emp => emp.manager_id !== 1 && emp.department === loggedInUserDepartment);

  const translations = {
    tr: {
      home: "Anasayfa",
      calendar: "Takvim",
      employees: "Takım Arkadaşlarım",
      search: "Ara..."
    },
    en: {
      home: "Home",
      calendar: "Calendar",
      employees: "Team Members",
      search: "Search..."
    }
  };

  return (
    <div className={`${darkMode ? "bg-gray-800 text-gray-200" : "bg-gray-100 text-gray-900"} h-screen p-6 relative flex`}>
      {/* Sidebar */}
      <div className={`fixed top-0 left-0 h-full w-64 bg-blue-900 text-white transform ${menuOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 shadow-lg z-50`}>
        <button className="absolute top-4 right-4 text-white text-2xl" onClick={() => setMenuOpen(false)}>
          <FaTimes />
        </button>
        <Sidebar menuOpen={menuOpen} setMenuOpen={setMenuOpen} darkMode={darkMode} language={language} />
      </div>

      <div className="flex flex-col flex-grow">
        {/* Navbar */}
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

        {/* Yönetici Kartı */}
        {manager && (
          <div 
            onClick={() => navigate(`/team-members/${manager.employee_id}`)}
            className={`bg-white ${darkMode ? "bg-yellow-200 text-gray-900" : "bg-yellow-100 text-black"} 
                        p-6 rounded-lg shadow-md flex flex-col items-center cursor-pointer 
                        hover:bg-gray-200 dark:hover:bg-yellow-300 transition mt-6`}>
            <img src={manager.photo_url || "https://via.placeholder.com/100"} 
                alt={manager.name} 
                className="w-24 h-24 rounded-full mb-2 object-cover" />
            <h3 className="text-lg font-semibold">{manager.name}</h3>
            <p className="text-sm text-gray-500">{manager.department}</p>
            <p className="text-sm text-gray-500 flex items-center gap-2 mt-2">
              <FaPhone /> {manager.phone_number}
            </p>
          </div>
        )}

        {/* Diğer Çalışanlar */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
          {otherEmployees.map((employee) => (
            <div 
              key={employee.employee_id} 
              onClick={() => navigate(`/team-members/${employee.employee_id}`)}
              className={`bg-white ${darkMode ? "bg-yellow-200 text-gray-900" : "bg-yellow-100 text-black"} 
                          p-4 rounded-lg shadow-md flex flex-col items-center cursor-pointer 
                          hover:bg-gray-200 dark:hover:bg-yellow-300 transition`}
            >
              <img src={employee.photo_url || "https://via.placeholder.com/80"} 
                  alt={employee.name} 
                  className="w-20 h-20 rounded-full mb-2 object-cover" />
              <h3 className="text-lg font-semibold">{employee.name}</h3>
              <p className="text-sm text-gray-500">{employee.department}</p>
              <p className="text-sm text-gray-500 flex items-center gap-2 mt-2">
                <FaPhone /> {employee.phone_number}
              </p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default TeamMembers;
