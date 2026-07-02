require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("🐾 Pet Friends Chatbot está no ar!(v2)");
});

app.get("/hello", (req, res) => {
  res.send("Olá, mundo! 🌍");
});

app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === process.env.WEBHOOK_VERIFY_TOKEN) {
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

app.post("/webhook", (req, res) => {
  console.log("📩 Recebi: ", req.body);
  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`🐾 Pet Friends Chatbot rodando em http://localhost:${PORT}`);
});
