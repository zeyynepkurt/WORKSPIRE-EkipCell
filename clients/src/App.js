import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard"; // Yeni eklenen sayfa
import TaskCalendar from "./components/Calendar"; // Takvim sayfasını ekledik
import TeamMembers from "./components/TeamMembers";
import TeamMemberDetail from "./components/TeamMemberDetails";
import PomodoroTimer from "./components/Pomodoro";
import ManagerHome from './components/ManagerHome';


function App() {
  // Kullanıcı giriş yapmış mı kontrol et
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
  const employeeId = localStorage.getItem("employeeId"); // Kullanıcının ID'si
  const managerId = localStorage.getItem("managerId");   // Kullanıcının Manager ID'si

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        
        {/* Kullanıcı giriş yapmışsa kendi Dashboard'una yönlendir */}
        <Route path="/home" element={isAuthenticated ? <Dashboard employeeId={employeeId} /> : <Navigate to="/" />} />

        {/* Yönetici (managerId = 1) ekranı */}
        <Route path="/manager" element={isAuthenticated && managerId === "1" ? <ManagerHome /> : <Navigate to="/" />} />
        
        {/* Diğer sayfalar */}
        <Route path="/calendar" element={isAuthenticated ? <TaskCalendar /> : <Navigate to="/" />} />  
        <Route path="/team-members" element={isAuthenticated ? <TeamMembers /> : <Navigate to="/" />} />
        <Route path="/team-members/:id" element={isAuthenticated ? <TeamMemberDetail /> : <Navigate to="/" />} />
        <Route path="/pomodoro" element={isAuthenticated ? <PomodoroTimer /> : <Navigate to="/" />} />

        {/* Geçersiz bir sayfa girildiğinde login'e yönlendirme */}
        <Route path="*" element={<Navigate to="/" />} /> 
      </Routes>
    </Router>
  );
}

export default App;
