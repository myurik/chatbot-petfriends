require("dotenv").config();
const express = require("express");
const { handleIncomingMessage } = require("./services/handlers");

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

app.post("/webhook", async (req, res) => {
  console.log("📩 Recebi:");
  console.dir(req.body, {depth:null});
  res.sendStatus(200);

  const message = req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
  if (!message) return;
  
  try{
      await handleIncomingMessage(message);
    } catch (err){}
    return;
  }
);

app.listen(PORT, () => {
  console.log(`🐾 Pet Friends Chatbot rodando em http://localhost:${PORT}`);
});
