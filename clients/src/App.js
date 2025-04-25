import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import TaskCalendar from "./components/Calendar";
import TeamMembers from "./components/TeamMembers";
import TeamMemberDetail from "./components/TeamMemberDetails";
import PomodoroTimer from "./components/Pomodoro";
import ManagerHome from "./components/ManagerHome";
import ChatPanel from "./components/ChatBox/ChatPanel";
import Layout from "./components/Layout";
import Scoreboard from "./components/Scoreboard";
import MemoryGame from "./components/MemoryGame";
import Home from "./components/Home";

function App() {
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
  const employeeId = localStorage.getItem("employeeId");
  const managerId = localStorage.getItem("managerId");

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />

        {/* Giriş yapılmış kullanıcılar için Layout sarmalayıcı */}
        {isAuthenticated && (
          <Route element={<Layout />}>
            <Route path="/home" element={<Home employeeId={employeeId} managerId={managerId} />} />
            <Route path="/calendar" element={<TaskCalendar />} />
            <Route path="/team-members" element={<TeamMembers />} />
            <Route path="/team-members/:id" element={<TeamMemberDetail />} />
            <Route path="/pomodoro" element={<PomodoroTimer />} />
            <Route path="/messages" element={<ChatPanel />} />
            <Route path="/scoreboard" element={<Scoreboard />} />
            <Route path="/game" element={<MemoryGame />} />
            <Route path="/manager" element={managerId === "1" ? <ManagerHome /> : <Navigate to="/" />} />
          </Route>
        )}

        {/* Geçersiz rota varsa giriş sayfasına yönlendir */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
