require("dotenv").config();
const express = require("express");
const { sendWhatsAppMessage, sendMainMenu } = require("./services/whatsapp");
const { HORARIO_E_ENDERECO, FORMAS_DE_PAGAMENTO, OUTRA_DUVIDA } = require("./services/faq")
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
  
  const from = message.from;

  if(message.type === "text"){
    try{
      await sendMainMenu(from);
    } catch (err){}
    return;
  }
  
  if(message.type === "interactive" && message.interactive?.type === "list_reply"){
    const selectedId = message.interactive.list_reply.id;
    let responseText;

    switch(selectedId){
      case "falar_atendente":
        responseText = "Perfeito! 💜\n\nJá estou passando aqui para Gislaine, ela vai te responder pessoalmente em instantes. Obrigado pela paciência! 🐾 "
        break;
      case "agendar_banho":
      case "leva_traz":
      case "info_horario":
        responseText = HORARIO_E_ENDERECO;
        break;
      case "info_pagamento":
        responseText = FORMAS_DE_PAGAMENTO;
        break;
      case "outra_duvida":
        responseText = OUTRA_DUVIDA;
        break;
      default: 
        responseText = "Opa, não entendi essa opção. Vou te passar pra Gislaine!";
    }

    try{
      await sendWhatsAppMessage(from, responseText);
    } catch (err){}
    return;
  }
});

app.listen(PORT, () => {
  console.log(`🐾 Pet Friends Chatbot rodando em http://localhost:${PORT}`);
});
