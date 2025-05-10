import React, { useEffect, useState } from "react";
import axios from "axios";

const PrioritizerPage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPrioritizedTasks = async () => {
      try {
        const response = await axios.get("http://localhost:5000/prioritizer/data?employeeId=5");
        setTasks(response.data);
      } catch (err) {
        console.error("Görevler alınamadı:", err.message);
        setError("Görevler alınamadı.");
      } finally {
        setLoading(false);
      }
    };

    fetchPrioritizedTasks();
  }, []);

  if (loading) return <p>Yükleniyor...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h2>📊 AI Önceliklendirilmiş Görevler</h2>
      {tasks.length === 0 ? (
        <p>Görev bulunamadı.</p>
      ) : (
        <ul>
          {tasks.map((task, index) => (
            <li key={task.task_id} style={{ marginBottom: "1rem" }}>
              <strong>{index + 1}. {task.task_name}</strong>  
              <br />
              Öncelik Skoru: {task.predicted_priority.toFixed(2)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PrioritizerPage;
