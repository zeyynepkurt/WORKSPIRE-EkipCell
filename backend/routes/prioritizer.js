//prioritizer.js
const express = require("express");
const router = express.Router();
const db = require("../db/db");
const pool = require('../db/db');
const { getTaskPriorities } = require("../utils/pythonClient");

// GET /prioritizer/data?employeeId=5
router.get("/data", async (req, res) => {
  const { employeeId } = req.query;

  try {
    // 1. Görevleri veritabanından al
    const taskQuery = await db.query(
      `SELECT task_id, task_name, score, deadline, created_at
       FROM assigned_tasks
       WHERE employee_id = $1 AND is_completed = false`,
      [employeeId]
    );
    const tasks = taskQuery.rows;

    // 2. Her görev için özellikleri hesapla
    const today = new Date();
    const processedTasks = await Promise.all(
      tasks.map(async (task) => {
        // Toplam skor al
        const scoreQuery = await db.query(
          `SELECT total_score FROM scores WHERE employee_id = $1`,
          [employeeId]
        );
        const totalScore = scoreQuery.rows[0]?.total_score || 0;

        // Gün sayıları
        const deadline = new Date(task.deadline);
        const createdAt = new Date(task.created_at);
        const daysUntilDeadline = Math.max(0, Math.ceil((deadline - today) / (1000 * 60 * 60 * 24)));
        const taskAge = Math.max(0, Math.ceil((today - createdAt) / (1000 * 60 * 60 * 24)));

        // Toplantı çakışması (şimdilik 0)
        const meetingOverlap = 0;

        return {
          task_id: task.task_id,
          task_name: task.task_name,
          score: task.score,
          days_until_deadline: daysUntilDeadline,
          employee_total_score: totalScore,
          task_age: taskAge,
          meeting_overlap: meetingOverlap,
        };
      })
    );

    // 3. Python modeline gönder
    const rankedTasks = await getTaskPriorities(processedTasks);
    res.json(rankedTasks);
    //res.json(processedTasks);

  } catch (err) {
    console.error("❌ Prioritizer route hatası:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
