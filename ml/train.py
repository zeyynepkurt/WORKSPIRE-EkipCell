import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error
import pickle

# 1. Rastgele görev verisi oluştur (100 görev)
np.random.seed(42)
data = {
    "score": np.random.randint(10, 100, 100),  # görev puanı
    "days_until_deadline": np.random.randint(0, 15, 100),  # kaç gün kaldı
    "employee_total_score": np.random.randint(0, 200, 100),  # çalışanın skoru
    "task_age": np.random.randint(0, 30, 100),  # görev kaç gün önce açıldı
    "meeting_overlap": np.random.randint(0, 3, 100),  # toplantı çakışması var mı
}

df = pd.DataFrame(data)

# 2. Yapay bir "priority" değeri üret (modelin öğreneceği hedef değişken)
df["priority"] = (
    df["score"] * 0.4
    - df["days_until_deadline"] * 2
    + df["employee_total_score"] * 0.2
    - df["task_age"] * 1
    - df["meeting_overlap"] * 5
    + np.random.normal(0, 5, size=len(df))  # biraz rastgelelik
)

# 3. Eğitim ve test setlerine ayır
X = df.drop("priority", axis=1)
y = df["priority"]
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

# 4. Modeli eğit
model = RandomForestRegressor()
model.fit(X_train, y_train)

# 5. Performansı ölç
y_pred = model.predict(X_test)
mse = mean_squared_error(y_test, y_pred)
print(f"Test MSE: {mse:.2f}")

# 6. Eğitilen modeli dosyaya kaydet
with open("ml/task_model.pkl", "wb") as f:
    pickle.dump(model, f)

print("✅ Model başarıyla kaydedildi: task_model.pkl")
