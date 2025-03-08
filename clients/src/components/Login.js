import { useState } from "react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Email: ${email}\nPassword: ${password}`);
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
        <form onSubmit={handleSubmit}>
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
  },
  lightCard: {
    backgroundColor: "#ffffff",
    padding: "30px",
    borderRadius: "12px",
    border: "1px solid #0b3d91",
    boxShadow: "0 6px 15px rgba(0, 0, 0, 0.2)",
    textAlign: "center",
    width: "350px",
    transition: "0.3s",
  },
  darkCard: {
    backgroundColor: "#000066",
    padding: "30px",
    borderRadius: "12px",
    border: "2px solid #ffcc00",
    boxShadow: "0 6px 15px rgba(255, 255, 255, 0.2)",
    textAlign: "center",
    width: "350px",
    transition: "0.3s",
  },
  lightTitle: {
    marginBottom: "20px",
    marginTop: "20",
    color: "#0b3d91",
  },
  darkTitle: {
    marginBottom: "20px",
    marginTop: "20",
    color: "#ffcc00",
  },
  lightInput: {
    width: "100%", // Login butonu ile eşit genişlik
    padding: "12px",
    marginBottom: "15px",
    borderRadius: "8px",
    border: "2px solid #0b3d91",
    fontSize: "16px",
    outline: "none",
    backgroundColor: "rgb(252, 253, 193)",
    color: "#333",
    boxSizing: "border-box", // Padding eklenince genişlik taşmasın
  },
  darkInput: {
    width: "100%", // Login butonu ile eşit genişlik
    padding: "12px",
    marginBottom: "15px",
    borderRadius: "8px",
    border: "2px solid #ffcc00",
    fontSize: "16px",
    outline: "none",
    backgroundColor: "#FFFFCC",
    color: "#fff",
    boxSizing: "border-box", // Padding eklenince genişlik taşmasın
  },
  lightButton: {
    width: "100%", // Buton ve input aynı genişlikte
    padding: "12px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#0b3d91",
    color: "#ffffff",
    fontSize: "16px",
    cursor: "pointer",
    transition: "0.3s",
    fontWeight: "bold",
    marginTop: "10px",
  },
  darkButton: {
    width: "100%", // Buton ve input aynı genişlikte
    padding: "12px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#ffbb00",
    color: "#0b3d91",
    fontSize: "16px",
    cursor: "pointer",
    transition: "0.3s",
    fontWeight: "bold",
    marginTop: "10px",
  },
  toggleContainer: {
    position: "absolute",
    top: "20px",
    right: "20px",
    display: "flex",
    gap: "5px",
  },
  toggleButton: {
    padding: "8px 12px",
    borderRadius: "20px",
    border: "1px solid #ccc",
    backgroundColor: "#f0f0f0",
    color: "#333",
    cursor: "pointer",
    fontSize: "14px",
  },
  activeToggleButton: {
    padding: "8px 12px",
    borderRadius: "20px",
    border: "1px solid #ffbb00",
    backgroundColor: "#ffbb00",
    color: "#0b3d91",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "bold",
  },
};

export default Login;
