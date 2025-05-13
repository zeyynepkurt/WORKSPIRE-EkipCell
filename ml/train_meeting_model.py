import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from sklearn.ensemble import RandomForestClassifier
import pickle
# Verileri el ile tanımlıyoruz
data = pd.DataFrame([
    {"participant_id": 2, "start_time": "2025-05-11 12:00", "end_time": "2025-05-11 13:00", "date": "2025-05-11"},
    {"participant_id": 5, "start_time": "2025-05-11 12:00", "end_time": "2025-05-11 13:00", "date": "2025-05-11"},
    {"participant_id": 6, "start_time": "2025-05-11 12:00", "end_time": "2025-05-11 13:00", "date": "2025-05-11"},
    {"participant_id": 2, "start_time": "2025-05-30 16:00", "end_time": "2025-05-30 17:30", "date": "2025-05-30"},
    {"participant_id": 5, "start_time": "2025-05-30 16:00", "end_time": "2025-05-30 17:30", "date": "2025-05-30"},
    {"participant_id": 6, "start_time": "2025-05-30 16:00", "end_time": "2025-05-30 17:30", "date": "2025-05-30"},
    {"participant_id": 4, "start_time": "2025-05-30 16:00", "end_time": "2025-05-30 17:30", "date": "2025-05-30"},
    {"participant_id": 7, "start_time": "2025-05-30 16:00", "end_time": "2025-05-30 17:30", "date": "2025-05-30"},
    {"participant_id": 2, "start_time": "2025-05-22 09:30", "end_time": "2025-05-22 11:00", "date": "2025-05-22"},
    {"participant_id": 6, "start_time": "2025-05-22 09:30", "end_time": "2025-05-22 11:00", "date": "2025-05-22"},
    {"participant_id": 4, "start_time": "2025-05-22 09:30", "end_time": "2025-05-22 11:00", "date": "2025-05-22"},
    {"participant_id": 5, "start_time": "2025-05-24 16:00", "end_time": "2025-05-24 17:30", "date": "2025-05-24"},
    {"participant_id": 2, "start_time": "2025-05-24 16:00", "end_time": "2025-05-24 17:30", "date": "2025-05-24"},
    {"participant_id": 7, "start_time": "2025-05-24 16:00", "end_time": "2025-05-24 17:30", "date": "2025-05-24"},
    {"participant_id": 5, "start_time": "2025-05-15 10:00", "end_time": "2025-05-15 11:00", "date": "2025-05-15"},
    {"participant_id": 6, "start_time": "2025-05-15 10:00", "end_time": "2025-05-15 11:00", "date": "2025-05-15"},
    {"participant_id": 4, "start_time": "2025-05-15 10:00", "end_time": "2025-05-15 11:00", "date": "2025-05-15"},
    {"participant_id": 4, "start_time": "2025-05-23 13:30", "end_time": "2025-05-23 15:00", "date": "2025-05-23"},
    {"participant_id": 6, "start_time": "2025-05-23 13:30", "end_time": "2025-05-23 15:00", "date": "2025-05-23"},
    {"participant_id": 2, "start_time": "2025-05-23 13:30", "end_time": "2025-05-23 15:00", "date": "2025-05-23"},
    {"participant_id": 7, "start_time": "2025-05-23 13:30", "end_time": "2025-05-23 15:00", "date": "2025-05-23"},
    {"participant_id": 4, "start_time": "2025-05-23 12:00", "end_time": "2025-05-23 13:00", "date": "2025-05-23"},
    {"participant_id": 5, "start_time": "2025-05-23 12:00", "end_time": "2025-05-23 13:00", "date": "2025-05-23"},
    {"participant_id": 7, "start_time": "2025-05-14 16:30", "end_time": "2025-05-14 17:30", "date": "2025-05-14"},
    {"participant_id": 6, "start_time": "2025-05-14 16:30", "end_time": "2025-05-14 17:30", "date": "2025-05-14"},
    {"participant_id": 4, "start_time": "2025-05-14 16:30", "end_time": "2025-05-14 17:30", "date": "2025-05-14"},
    {"participant_id": 7, "start_time": "2025-05-20 09:00", "end_time": "2025-05-20 11:00", "date": "2025-05-20"},
    {"participant_id": 5, "start_time": "2025-05-20 09:00", "end_time": "2025-05-20 11:00", "date": "2025-05-20"},
    {"participant_id": 6, "start_time": "2025-05-20 09:00", "end_time": "2025-05-20 11:00", "date": "2025-05-20"},
    {"participant_id": 4, "start_time": "2025-05-20 09:00", "end_time": "2025-05-20 11:00", "date": "2025-05-20"},
])

# Tarih formatlarını datetime nesnesine çevir
data['start_time'] = pd.to_datetime(data['start_time'])
data['end_time'] = pd.to_datetime(data['end_time'])
data['date'] = pd.to_datetime(data['date'])

records = []
user_ids = data['participant_id'].unique()

for uid in user_ids:
    user_meetings = data[data['participant_id'] == uid]

    for date in pd.date_range("2025-05-11", "2025-05-30"):
        for hour in range(9, 18):  # Saat 09:00 - 17:00 arası
            slot_start = pd.Timestamp(date).replace(hour=hour, minute=0, second=0)
            slot_end = slot_start + timedelta(hours=1)

            conflicts = user_meetings[
                (user_meetings['start_time'] < slot_end) &
                (user_meetings['end_time'] > slot_start)
            ]

            label = 0 if not conflicts.empty else 1

            records.append({
                "participant_count": 3,  # Varsayılan değerle eğitim, modeldeki alanla eşleşmesi için
                "day_of_week": slot_start.weekday(),
                "hour": hour,
                "duration": 60,
                "label": label
            })

df = pd.DataFrame(records)

# Özellik ve hedef kolonlarını belirle
feature_cols = ["participant_count", "day_of_week", "hour", "duration"]
X = df[feature_cols]
y = df["label"]

# Model eğitimi
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X, y)

# Modelle birlikte feature isimlerini de kaydet
with open("ml/meeting_model_rf.pkl", "wb") as f:
    pickle.dump({"model": model, "features": feature_cols}, f)

print("✅ Eğitim tamamlandı. Model ve feature isimleri kaydedildi.")