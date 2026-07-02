const express = require("express");
const app = express();
const PORT = 3000;

app.get("/", (req, res) => {
  res.send("🐾 Pet Friends Chatbot está no ar!(v2)");
});

app.get("/hello", (req, res) => {
  res.send("Olá, mundo! 🌍");
});

app.listen(PORT, () => {
  console.log(`🐾 Pet Friends Chatbot rodando em http://localhost:${PORT}`);
});
