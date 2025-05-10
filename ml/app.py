from flask import Flask, request, jsonify
import pickle
import numpy as np

# Flask app başlat
app = Flask(__name__)

# Eğitilmiş modeli yükle
with open("task_model.pkl", "rb") as f:
    model = pickle.load(f)

# POST /predict endpoint’i
@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()
    tasks = data.get("tasks", [])

    features = []
    for task in tasks:
        # Giriş sırası: score, days_until_deadline, employee_total_score, task_age, meeting_overlap
        features.append([
            task["score"],
            task["days_until_deadline"],
            task["employee_total_score"],
            task["task_age"],
            task["meeting_overlap"]
        ])

    predictions = model.predict(np.array(features))
    
    # Her göreve tahmin edilen önceliği ekleyip geri dön
    for i in range(len(tasks)):
        tasks[i]["predicted_priority"] = predictions[i]

    # Önceliğe göre azalan sırada sırala
    tasks_sorted = sorted(tasks, key=lambda x: -x["predicted_priority"])
    return jsonify(tasks_sorted)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001)

