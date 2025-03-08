import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard"; // Yeni eklenen sayfa

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Dashboard />} />
        <Route path="*" element={<Navigate to="/" />} /> {/* Geçersiz bir sayfa girildiğinde login'e yönlendirme */}
      </Routes>
    </Router>
  );
}

export default App;
