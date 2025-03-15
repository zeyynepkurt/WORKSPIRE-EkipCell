const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const pool = require('./db/db');

const app = express();
app.use(cors());
app.use(express.json());

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const userResult = await pool.query("SELECT email, password, department FROM employees WHERE email = $1", [email]);

    if (userResult.rows.length === 0) {
      return res.status(401).json({ message: "Kullanıcı bulunamadı" });
    }

    const user = userResult.rows[0];

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: "Geçersiz şifre" });
    }

    const token = jwt.sign({ email: user.email }, "mysecretkey", { expiresIn: "1h" });

    res.json({ token, email: user.email, department: user.department });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Sunucu hatası" });
  }
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


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} numaralı portta çalışıyor`);
});
