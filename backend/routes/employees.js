const express = require('express');
const router = express.Router();
const pool = require('../db/db');

router.get('/manager/:managerId', async (req, res) => {
    const { managerId } = req.params;
    try {
        const result = await pool.query(
            `SELECT employee_id, name, email, department, phone_number
             FROM employees
             WHERE manager_id = $1`,
            [parseInt(managerId, 10)]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Bu yöneticinin altında çalışan bulunamadı.' });
        }

        res.json(result.rows);
    } catch (error) {
        console.error("Employees route error:", error);
        res.status(500).json({ message: 'Sunucu hatası.' });
    }
});

router.get('/assigned-tasks/:employeeId', async (req, res) => {
    const { employeeId } = req.params;
    try {
        const result = await pool.query(
            `SELECT task_id, task_name, task_description, deadline, score, is_completed
             FROM assigned_tasks
             WHERE employee_id = $1`,
            [employeeId]
        );

        res.json(result.rows);
    } catch (error) {
        console.error("Atanmış görevler alınamadı:", error);
        res.status(500).json({ message: "Sunucu hatası." });
    }
});

router.put('/assigned-tasks/:taskId', async (req, res) => {
    const { taskId } = req.params;
    const { is_completed } = req.body;

    try {
        await pool.query(
            `UPDATE assigned_tasks SET is_completed=$1 WHERE task_id=$2 RETURNING *`,
            [is_completed, taskId]
        );
        res.json({ message: "Başarıyla güncellendi." });
    } catch (error) {
        console.error("Assigned task güncelleme hatası:", error);
        res.status(500).json({ message: "Sunucu hatası." });
    }
});

module.exports = router;
