const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const employeeRoutes = require('./routes/employees');
const pool = require('./db/db');
const app = express();
app.use(cors());
app.use(express.json());
app.use('/employees', employeeRoutes);
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const userResult = await pool.query(
      "SELECT employee_id, email, password, department, manager_id FROM employees WHERE email = $1",
      [email]
    );

    if (userResult.rows.length === 0) {
      return res.status(400).json({ message: "Kullanıcı bulunamadı." });
    }

    const user = userResult.rows[0];

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(400).json({ message: "Şifre yanlış." });
    }

    const token = jwt.sign(
      { employee_id: user.employee_id, manager_id: user.manager_id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      token,
      email: user.email,
      department: user.department,
      employee_id: user.employee_id,
      manager_id: user.manager_id  // Manager ID döndürüldüğünden emin ol
    });
  } catch (error) {
    console.error("Hata:", error);
    res.status(500).json({ message: "Sunucu hatası." });
  }
});

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "API is running" });
});

app.get("/", (req, res) => {
  res.send("API is running...");
});


app.get("/employees", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        employee_id AS id, 
        name, 
        email, 
        department, 
        phone_number, 
        photo_url, 
        CASE 
          WHEN manager_id = 1 THEN 'Manager' 
          ELSE department 
        END AS role
      FROM employees
    `);
    res.json(result.rows);
  } catch (err) {
    console.error("Veriler getirilemedi:", err.message);
    res.status(500).json({ message: "Veriler getirilemedi!" });
  }
});

app.get("/employees/:email", async (req, res) => {
  try {
    const { email } = req.params;

    // Kullanıcının departmanını bul
    const userResult = await pool.query("SELECT department FROM employees WHERE email = $1", [email]);

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı!" });
    }

    const userDepartment = userResult.rows[0].department;

    // Aynı departmandaki çalışanları getir
    const result = await pool.query(
      "SELECT employee_id, name, manager_id, department, phone_number, photo_url FROM employees WHERE department = $1",
      [userDepartment]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Veriler getirilemedi:", err.message);
    res.status(500).json({ message: "Veriler getirilemedi!" });
  }
});

app.get("/todos/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await pool.query(
      "SELECT * FROM todos WHERE user_id = $1 ORDER BY created_at DESC",
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("ToDo getirme hatası:", err.message);
    res.status(500).json({ message: "Sunucu hatası" });
  }
});


const PORT = process.env.PORT || 5000;

// 🔹 GET: Kullanıcının görevlerini getir
app.get("/api/todos/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM todos WHERE user_id = $1 ORDER BY created_at DESC",
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("GET /todos error:", err.message);
    res.status(500).json({ error: "Veriler alınamadı." });
  }
});

// 🔹 POST: Yeni görev oluştur
app.post("/api/todos", async (req, res) => {
  const { user_id, title, description } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO todos (user_id, title, description) VALUES ($1, $2, $3) RETURNING *",
      [user_id, title, description]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("POST /todos error:", err.message);
    res.status(500).json({ error: "Görev eklenemedi." });
  }
});

// 🔹 PUT: Görev tamamlandı durumu güncelle
app.put("/api/todos/:id", async (req, res) => {
  const { id } = req.params;
  const { is_completed } = req.body;
  try {
    const result = await pool.query(
      "UPDATE todos SET is_completed = $1 WHERE todo_id = $2 RETURNING *",
      [is_completed, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error("PUT /todos error:", err.message);
    res.status(500).json({ error: "Güncelleme başarısız." });
  }
});

// 🔹 DELETE: Görevi sil
app.delete("/api/todos/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM todos WHERE todo_id = $1", [id]);
    res.status(204).send();
  } catch (err) {
    console.error("DELETE /todos error:", err.message);
    res.status(500).json({ error: "Silme başarısız." });
  }
});

// Test endpoint
app.get("/", (req, res) => {
  res.send("Todo API çalışıyor 🚀");
});


app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} numaralı portta çalışıyor`);
});

// Atanan Görevleri Getirme API'si
app.get("/assigned-tasks/:employeeId", async (req, res) => {
  const { employeeId } = req.params;
  try {
      const result = await pool.query(
          "SELECT * FROM assigned_tasks WHERE employee_id = $1",
          [employeeId]
      );

      if (result.rows.length === 0) {
          return res.status(404).json({ message: "Bu çalışana atanmış görev bulunamadı." });
      }

      res.json(result.rows);
  } catch (error) {
      console.error("Atanan görevler getirilemedi:", error);
      res.status(500).json({ message: "Sunucu hatası." });
  }
});

