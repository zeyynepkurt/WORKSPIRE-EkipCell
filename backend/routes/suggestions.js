// backend/routes/suggestions.js
const express = require("express");
const router = express.Router();
const db = require("../db/db");
const axios = require("axios");

// POST /api/meeting-suggestions/suggest
router.post("/suggest", async (req, res) => {
  try {
    const { participants } = req.body;

    if (!participants || !Array.isArray(participants) || participants.length === 0) {
      return res.status(400).json({ error: "Katılımcı listesi gerekli." });
    }

    // Seçilen katılımcılara ait gelecekteki toplantıları al
    const futureMeetings = await db.query(
      `
      SELECT participant_id, start_time, end_time
      FROM meetings
      WHERE start_time >= NOW() AND participant_id = ANY($1)
      `,
      [participants]
    );

    const meetings = {};
    for (let row of futureMeetings.rows) {
      const pid = row.participant_id;
      if (!meetings[pid]) meetings[pid] = [];
      meetings[pid].push({
        start_time: row.start_time.toISOString(),
        end_time: row.end_time.toISOString(),
      });
    }

    // ML modeline istek
    const response = await axios.post("http://ml:5001/predict-meeting-slots", {
      participants,
      meetings,
    });

    res.json(response.data);
  } catch (error) {
    console.error("[SUGGESTION ERROR]", error);
    res.status(500).json({ error: "Failed to fetch meeting suggestions." });
  }
});

module.exports = router;
