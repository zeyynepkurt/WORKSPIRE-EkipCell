const express = require('express');
const router = express.Router();
const db = require('../db/db');

// Bu satırı index.js içinden `io` nesnesini aktarmak için kullanacaksın
let io;
function setSocketIO(ioInstance) {
  io = ioInstance;
}

// Toplantı oluşturma endpoint'i
router.post('/', async (req, res) => {
  const { title, host_id, participant_ids, start_time, end_time, date, team_name, organizer_id } = req.body;
  console.log("📥 Gelen POST verisi:", req.body);

  if (!title || !host_id || !participant_ids || !start_time || !end_time || !date) {
    return res.status(400).json({ error: 'Eksik bilgi gönderildi' });
  }

  const meeting_id = Date.now();
  const allParticipantIds = [host_id, ...participant_ids];

  try {
    // ⛔ Çakışma kontrolü
    const conflictQuery = `
      SELECT * FROM meetings
      WHERE participant_id = ANY($1)
        AND date = $2
        AND NOT ($3 >= end_time OR $4 <= start_time)
    `;
    const { rows: conflicts } = await db.query(conflictQuery, [allParticipantIds, date, start_time, end_time]);

    if (conflicts.length > 0) {
      return res.status(400).json({ error: 'Katılımcılardan biri o saatte başka bir toplantıda.' });
    }

    const saat = start_time.slice(11, 16);
    const msg = `${saat} saatinde "${title}" toplantınız var.`;

    // Her kullanıcı için toplantıyı kaydet + bildirim gönder
    for (const participant_id of allParticipantIds) {
      await db.query(
        `INSERT INTO meetings (
          meeting_id, title, host_id, participant_id, start_time, end_time, date, team_name, organizer_id
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [meeting_id, title, host_id, participant_id, start_time, end_time, date, team_name, organizer_id]
      );

      // 🔔 Bildirimi veritabanına ekle
      await db.query(
        `INSERT INTO notifications (employee_id, message)
         VALUES ($1, $2)`,
        [participant_id, msg]
      );

      // 📡 Socket ile canlı bildirimi gönder
      if (io) {
        io.emit("receiveNotification", {
          employee_id: participant_id,
          message: msg
        });
      }
    }

    res.status(201).json({ message: 'Toplantı başarıyla oluşturuldu', meeting_id });

  } catch (err) {
    console.error('Toplantı eklenirken hata oluştu:', err);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

// Tüm toplantıları getir
router.get('/all', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        m.meeting_id, 
        m.title, 
        m.host_id, 
        m.participant_id, 
        m.start_time, 
        m.end_time, 
        m.date,
        e.name AS participant_name
      FROM meetings m
      JOIN employees e ON m.participant_id = e.employee_id
      ORDER BY m.date, m.start_time
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Tüm toplantılar alınamadı:', err);
    res.status(500).json({ error: 'Toplantılar alınamadı' });
  }
});

// Belirli kullanıcıya ait toplantılar
router.get('/:user_id', async (req, res) => {
  const { user_id } = req.params;
  try {
    const result = await pool.query(
  `SELECT 
     m.*, 
     e.name AS participant_name 
   FROM meetings m
   JOIN employees e ON m.participant_id = e.employee_id
   WHERE m.host_id = $1 OR m.participant_id = $1`,
  [employee_id]
);
    res.json(result.rows);
  } catch (err) {
    console.error('Toplantılar alınamadı:', err);
    res.status(500).json({ error: 'Toplantılar alınamadı' });
  }
});

// io'yu dışarıdan alabilmek için export ediyoruz
module.exports = router;
  
