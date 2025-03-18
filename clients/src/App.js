import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard"; // Yeni eklenen sayfa
import TaskCalendar from "./components/Calendar"; // Takvim sayfasını ekledik
import TeamMembers from "./components/TeamMembers";
import TeamMemberDetail from "./components/TeamMemberDetails";
import PomodoroTimer from "./components/Pomodoro";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Dashboard />} />
        <Route path="/calendar" element={<TaskCalendar />} />  
        <Route path="*" element={<Navigate to="/" />} /> {/* Geçersiz bir sayfa girildiğinde login'e yönlendirme */}
        <Route path="/team-members" element={<TeamMembers />} />
        <Route path="/team-members/:id" element={<TeamMemberDetail />} />
        <Route path="/pomodoro" element={<PomodoroTimer />} />

      </Routes>
    </Router>
  );
}

export default App;
