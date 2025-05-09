const express = require('express');
const router = express.Router();
const pool = require('../db/db');

// Görev ekleme
router.post('/add', async (req, res) => {
    const { employeeId, title, startTime, endTime } = req.body;

    try {
        const result = await pool.query(
            'INSERT INTO personal_tasks (employee_id, title, start_time, end_time) VALUES ($1, $2, $3, $4) RETURNING *',
            [employeeId, title, startTime, endTime]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Görev eklenirken hata:', err);
        res.status(500).send('Sunucu hatası');
    }
});

// Belirli çalışanın görevlerini çekme
router.get('/:employeeId', async (req, res) => {
    const { employeeId } = req.params;

    try {
        const result = await pool.query(
            'SELECT * FROM personal_tasks WHERE employee_id = $1 ORDER BY start_time ASC',
            [employeeId]
        );
        res.json(result.rows);
    } catch (err) {
        console.error('Görevleri çekerken hata:', err);
        res.status(500).send('Sunucu hatası');
    }
});

module.exports = router;
