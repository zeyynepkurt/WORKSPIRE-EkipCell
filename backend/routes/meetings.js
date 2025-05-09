const express = require('express');
const router = express.Router();
const db = require('../db/db');
 // db bağlantı modülünüz bu dosyada tanımlı olmalı

// Toplantı oluşturma endpoint'i
router.post('/', async (req, res) => {
  const { title, host_id, participant_ids, start_time, end_time, date } = req.body;

  if (!title || !host_id || !participant_ids || !start_time || !end_time || !date) {
    return res.status(400).json({ error: 'Eksik bilgi gönderildi' });
  }

  const meeting_id = Date.now(); // basit bir unique ID

  // Hem host hem katılımcılar birlikte kontrol edilecek
  const allParticipantIds = [host_id, ...participant_ids];

  try {
    // Çakışma kontrolü
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

    // Tüm kullanıcılar için (host + diğerleri) kayıt ekleniyor
    for (const participant_id of allParticipantIds) {
      await db.query(
        `INSERT INTO meetings (meeting_id, title, host_id, participant_id, start_time, end_time, date)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [meeting_id, title, host_id, participant_id, start_time, end_time, date]
      );
    }

    res.status(201).json({ message: 'Toplantı başarıyla oluşturuldu', meeting_id });

  } catch (err) {
    console.error('Toplantı eklenirken hata oluştu:', err);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});


router.get('/all', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT meeting_id, title, host_id, participant_id, start_time, end_time, date
      FROM meetings
      ORDER BY date, start_time
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Tüm toplantılar alınamadı:', err);
    res.status(500).json({ error: 'Toplantılar alınamadı' });
  }
});

// Kullanıcının dahil olduğu tüm toplantıları getir
router.get('/:user_id', async (req, res) => {
    const { user_id } = req.params;
  
    try {
      const result = await db.query(
        `SELECT meeting_id, title, host_id, participant_id, start_time, end_time, date
         FROM meetings
         WHERE participant_id = $1 OR host_id = $1
         ORDER BY date, start_time`,
        [user_id]
      );
  
      res.json(result.rows);
    } catch (err) {
      console.error('Toplantılar alınamadı:', err);
      res.status(500).json({ error: 'Toplantılar alınamadı' });
    }
  });
 
  
  

module.exports = router;
