const axios = require("axios");

async function getTaskPriorities(tasks) {
  try {
    const response = await axios.post("http://ml:5001/predict", { tasks });
    console.log("🎯 AI'den gelen cevap:", response.data);
    return response.data;
  } catch (error) {
    console.error("⚠️ AI servisine bağlanılamadı:", error.message);
    if (error.response) {
      console.error("📦 Response data:", error.response.data);
      console.error("📦 Status:", error.response.status);
      console.error("📦 Headers:", error.response.headers);
    } else if (error.request) {
      console.error("📡 Request:", error.request);
    } else {
      console.error("❌ Error:", error.message);
    }
    return [];
  }
}

module.exports = { getTaskPriorities };
