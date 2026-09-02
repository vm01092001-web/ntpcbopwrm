window.SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxZFKq5QFXFv2ru1YTfgtx5cHhFvvQUc108pFrFB0Kba9YaWsncVNTxU6ASXJDk9FkZZg/exec"; // <-- PASTE YOUR APPS SCRIPT URL HERE

window.apiPost = async (payload) => {
  try {
    const res = await fetch(window.SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload)
    });
    return await res.json();
  } catch (err) {
    return { status: 500, error: err.message };
  }
};

window.formatDate = (val) => {
  if (!val) return ""; 
  const d = new Date(val); 
  if (isNaN(d.getTime())) return val;
  return new Date(d.getTime() - (d.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
};
