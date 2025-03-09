const express = require("express");
const router = express.Router();
const pool = require("./db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Kullanıcıyı doğru veritabanından çek
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

    if (user.rows.length === 0) {
      return res.status(401).json({ message: "Kullanıcı bulunamadı" });
    }

    // Şifre doğrulama (PostgreSQL'deki 'password_hash' sütununu kullan)
    const validPassword = await bcrypt.compare(password, user.rows[0].password_hash);
    if (!validPassword) {
      return res.status(401).json({ message: "Hatalı şifre" });
    }

    // JWT Token oluştur
    const token = jwt.sign(
      { id: user.rows[0].id, isAdmin: user.rows[0].is_admin }, 
      process.env.JWT_SECRET, 
      { expiresIn: "1h" }
    );

    res.json({ token, isAdmin: user.rows[0].is_admin });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Sunucu hatası");
  }
});

module.exports = router;
