from flask import Flask, request, jsonify
import pickle
import numpy as np
from flask_cors import CORS 

from datetime import datetime, timedelta

# Flask app başlat
app = Flask(__name__)
CORS(app)  # Tüm domainlere izin verir

# Task öncelik modeli yükleniyor
with open("task_model.pkl", "rb") as f:
    task_model = pickle.load(f)

# Toplantı öneri modeli yükleniyor
with open("meeting_model_rf.pkl", "rb") as f:
    model_data = pickle.load(f)
    meeting_model = model_data["model"]
    feature_names = model_data["features"]


# TASK: /predict
@app.route("/predict", methods=["POST"])
def predict_task_priority():
    data = request.get_json()
    tasks = data.get("tasks", [])

    features = []
    for task in tasks:
        features.append([
            task["score"],
            task["days_until_deadline"],
            task["employee_total_score"],
            task["task_age"],
            task["meeting_overlap"]
        ])

    predictions = task_model.predict(np.array(features))
    for i in range(len(tasks)):
        tasks[i]["predicted_priority"] = predictions[i]

    tasks_sorted = sorted(tasks, key=lambda x: -x["predicted_priority"])
    return jsonify(tasks_sorted)

@app.route("/predict-meeting-slots", methods=["POST"])
def predict_meeting_slots():
    try:
        data = request.get_json()
        print("🧪 Gelen ham veri:", data)

        participants = data["participants"]
        duration = int(data["duration"])
        meetings = data.get("meetings", {})

        print("📥 Katılımcılar:", participants)
        print("⏱️ Süre (dakika):", duration)
        print("📆 Gelen meetings verisi:")
        for pid, user_meetings in meetings.items():
            print(f"  👤 Kullanıcı {pid}:")
            for m in user_meetings:
                print(f"    - {m['start_time']} → {m['end_time']}")

        from collections import defaultdict
        import pandas as pd

        # Busy slot'ları oluştur
        busy_slots = defaultdict(list)
        for user_id, user_meetings in meetings.items():
            for m in user_meetings:
                start = datetime.fromisoformat(m['start_time'].replace("Z", ""))
                end = datetime.fromisoformat(m['end_time'].replace("Z", ""))
                busy_slots[str(user_id)].append((start, end))

        print("\n⛔ Çakışma saatleri:")
        for uid, slots in busy_slots.items():
            for s, e in slots:
                print(f"  👤 {uid}: {s} → {e}")

        now = datetime.now().replace(minute=0, second=0, microsecond=0)
        suggestions = []

        for day_offset in range(7):  # 7 günlük öneri
            day = now + timedelta(days=day_offset)
            dow = day.weekday()

            for hour in range(9, 18):
                slot_start = day.replace(hour=hour)
                slot_end = slot_start + timedelta(minutes=duration)

                # ⛔ GEÇMİŞTEKİ ZAMANLARI ATLAMAK İÇİN
                if slot_start < now:
                    continue

                conflict = False
                for user_id in participants:
                    for b_start, b_end in busy_slots.get(str(user_id), []):
                        if slot_start < b_end and slot_end > b_start:
                            conflict = True
                            print(f"❌ Çakışma: {user_id} {slot_start} ↔ {b_start} → {b_end}")
                            break
                    if conflict:
                        break

                if not conflict:
                    features_df = pd.DataFrame([{
                        "participant_count": len(participants),
                        "day_of_week": dow,
                        "hour": hour,
                        "duration": duration
                    }])[feature_names]  # doğru sıralamayla

                    score = meeting_model.predict_proba(features_df)[0][1]
 

                    suggestions.append({
                        "start": slot_start.isoformat(),
                        "end": slot_end.isoformat(),
                        "score": float(score)
                    })


        top3 = sorted(suggestions, key=lambda x: x["score"], reverse=True)[:3]
        print("\n✅ Önerilen zamanlar:")
        for s in top3:
            print(f"  {s['start']} → {s['end']} (score: {s['score']:.2f})")

        return jsonify(top3)

    except Exception as e:
        import traceback
        print("\n❌ HATA:", e)
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500



@app.route("/api/meeting-suggestions/suggest", methods=["POST"])
def suggest_meeting_slots():
    return predict_meeting_slots()

@app.errorhandler(Exception)
def handle_exception(e):
    import traceback
    print("\n🔥 INTERNAL ERROR:", e)
    traceback.print_exc()
    return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001)
