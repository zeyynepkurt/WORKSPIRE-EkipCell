import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import TaskCalendar from "./components/Calendar";
import TeamMembers from "./components/TeamMembers";
import TeamMemberDetail from "./components/TeamMemberDetails";
import PomodoroTimer from "./components/Pomodoro";
import ManagerHome from "./components/ManagerHome";
import ChatPage from "./components/ChatPage";
import Layout from "./components/Layout";
import Scoreboard from "./components/Scoreboard";
import MemoryGame from "./components/MemoryGame";

function App() {
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
  const employeeId = localStorage.getItem("employeeId");
  const managerId = localStorage.getItem("managerId");

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />

        {/** Giriş yapılmış kullanıcılar için Layout içeren sayfalar */}
        {isAuthenticated && (
          <Route element={<Layout />}>
            <Route path="/home" element={<Dashboard employeeId={employeeId} />} />
            <Route path="/calendar" element={<TaskCalendar />} />
            <Route path="/team-members" element={<TeamMembers />} />
            <Route path="/team-members/:id" element={<TeamMemberDetail />} />
            <Route path="/pomodoro" element={<PomodoroTimer />} />
            <Route path="/messages" element={<ChatPage />} />
            <Route path="/scoreboard" element={<Scoreboard />} />
            <Route path="/game" element={<MemoryGame />} />
          </Route>
        )}

        {/** Yönetici sayfası ayrı kontrol edilir */}
        <Route
          path="/manager"
          element={isAuthenticated && managerId === "1" ? <ManagerHome /> : <Navigate to="/" />}
        />

        {/** Hatalı rota */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App; 