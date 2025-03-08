import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem("isAuthenticated", "true");
    navigate("/home");
  };

  return (
    <div style={darkMode ? styles.darkContainer : styles.lightContainer}>
      {/* Sağ Üstte Light/Dark Toggle Butonları */}
      <div style={styles.toggleContainer}>
        <button
          onClick={() => setDarkMode(false)}
          style={darkMode ? styles.toggleButton : styles.activeToggleButton}
        >
          ☀ Light
        </button>
        <button
          onClick={() => setDarkMode(true)}
          style={darkMode ? styles.activeToggleButton : styles.toggleButton}
        >
          🌙 Dark
        </button>
      </div>

      <div style={darkMode ? styles.darkCard : styles.lightCard}>
        <h2 style={darkMode ? styles.darkTitle : styles.lightTitle}>Login</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={darkMode ? styles.darkInput : styles.lightInput}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={darkMode ? styles.darkInput : styles.lightInput}
          />
          <button type="submit" style={darkMode ? styles.darkButton : styles.lightButton}>Login</button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  lightContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#fdf6e3",
    transition: "0.3s",
    position: "relative",
    fontWeight: "bold",
  },
  darkContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#000033",
    transition: "0.3s",
    position: "relative",
    fontWeight: "bold",
  },
  lightCard: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: "3vw",
    borderRadius: "2vw",
    border: "0.3vw solid #0b3d91",
    boxShadow: "0 1vw 2vw rgba(0, 0, 0, 0.2)",
    textAlign: "center",
    width: "30vw",
    minWidth: "300px",
    height: "65vh",
    minHeight: "480px",
    transition: "0.3s",
  },
  darkCard: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000066",
    padding: "3vw",
    borderRadius: "2vw",
    border: "0.3vw solid #ffcc00",
    boxShadow: "0 1vw 2vw rgba(255, 255, 255, 0.2)",
    textAlign: "center",
    width: "30vw",
    minWidth: "300px",
    height: "65vh",
    minHeight: "480px",
    transition: "0.3s",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    gap: "4vh", // Aralığı artırdık
  },
  lightTitle: {
    marginBottom: "4vh",
    fontSize: "3vw",
    color: "#0b3d91",
    textAlign: "center",
  },
  darkTitle: {
    marginBottom: "4vh",
    fontSize: "3vw",
    color: "#ffcc00",
    textAlign: "center",
  },
  lightInput: {
    width: "85%",
    padding: "2.5vh",
    borderRadius: "1vw",
    border: "0.3vw solid #0b3d91",
    fontSize: "2vw",
    outline: "none",
    backgroundColor: "rgb(252, 253, 193)",
    color: "#333",
    boxSizing: "border-box",
    textAlign: "center",
    marginBottom: "2vh", // Aralık artırıldı
  },
  darkInput: {
    width: "85%",
    padding: "2.5vh",
    borderRadius: "1vw",
    border: "0.3vw solid #ffcc00",
    fontSize: "2vw",
    outline: "none",
    backgroundColor: "#FFFFCC",
    color: "#000",
    boxSizing: "border-box",
    textAlign: "center",
    marginBottom: "2vh", // Aralık artırıldı
  },
  lightButton: {
    width: "85%",
    padding: "2.5vh",
    borderRadius: "1vw",
    border: "none",
    backgroundColor: "#0b3d91",
    color: "#ffffff",
    fontSize: "2vw",
    cursor: "pointer",
    transition: "0.3s",
    fontWeight: "bold",
  },
  darkButton: {
    width: "85%",
    padding: "2.5vh",
    borderRadius: "1vw",
    border: "none",
    backgroundColor: "#ffbb00",
    color: "#0b3d91",
    fontSize: "2vw",
    cursor: "pointer",
    transition: "0.3s",
    fontWeight: "bold",
  },
  toggleContainer: {
    position: "absolute",
    top: "2vh",
    right: "2vw",
    display: "flex",
    gap: "1vw",
  },
  toggleButton: {
    padding: "1vh 2vw",
    borderRadius: "2vw",
    border: "0.2vw solid #ccc",
    backgroundColor: "#f0f0f0",
    color: "#333",
    cursor: "pointer",
    fontSize: "1.5vw",
  },
  activeToggleButton: {
    padding: "1vh 2vw",
    borderRadius: "2vw",
    border: "0.2vw solid #ffbb00",
    backgroundColor: "#ffbb00",
    color: "#0b3d91",
    cursor: "pointer",
    fontSize: "1.5vw",
    fontWeight: "bold",
  },
};

export default Login;
