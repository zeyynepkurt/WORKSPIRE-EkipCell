// backend/routes/meetingSuggestions.js

const express = require("express");
const router = express.Router();
const db = require("../db/db");
const axios = require("axios");

router.get('/department/:department', async (req, res) => {
  const { department } = req.params;
  try {
    const result = await pool.query(
      `SELECT employee_id, name FROM employees WHERE department = $1`,
      [department]
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Departman çalışanları alınamadı:", error);
    res.status(500).json({ message: "Sunucu hatası." });
  }
});


// Katılımcılara göre uygun toplantı zamanları
router.post("/suggest", async (req, res) => {
  try {
    const { participants } = req.body;
    if (!participants || participants.length === 0) {
      return res.status(400).json({ error: "Katılımcı listesi boş olamaz." });
    }

    const meetingsRes = await db.query(`
      SELECT participant_id, start_time, end_time
      FROM meetings
      WHERE participant_id = ANY($1)
    `, [participants]);

    // Toplantı verilerini grupla
    const meetingsGrouped = {};
    meetingsRes.rows.forEach((m) => {
      const pid = m.participant_id;
      if (!meetingsGrouped[pid]) meetingsGrouped[pid] = [];
      meetingsGrouped[pid].push({
        start_time: m.start_time,
        end_time: m.end_time,
      });
    });

    const pythonRes = await axios.post("http://ml:5001/predict-meeting-slots", {
      participants,
      meetings: meetingsGrouped
    });

    res.json(pythonRes.data);
  } catch (err) {
    console.error("Öneri üretirken hata:", err.message);
    res.status(500).json({ error: "Bir şeyler ters gitti." });
  }
});

module.exports = router;
