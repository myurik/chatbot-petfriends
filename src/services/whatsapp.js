const axios = require('axios');

async function sendToMeta(body){
    if (process.env.BOT_MODE === "mock") {
        console.log(`🔵 [MOCK] Enviaria: `, JSON.stringify(body,null,2));
        return { mock: true };
    }

    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
    const url = `https://graph.facebook.com/v25.0/${phoneNumberId}/messages`
    const headers = {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json"
    };

    try{
        const response = await axios.post(url, body, {headers});
        console.log("✅ Mensagem enviada:", response.data);
        return response.data;
    }catch (error){
        console.error("❌ Erro ao enviar:", error.response?.data || error.message);
        throw error;
    }
}

async function sendWhatsAppMessage(to, text) {
    const body = {
        messaging_product: "whatsapp",
        to: to,
        type: "text",
        text: {body:text}
    };

    return sendToMeta(body);
}

async function sendMainMenu(to){
    const body = {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: to,
        type: "interactive",
        interactive: {
            type:"list",
            header: {
                type: "text",
                text: "🐾 Pet Friends"
            },
            body: {
                text: "Olá! Que bom te ver por aqui 💜\n\nEu sou o assistente virtual do Pet Friends. Como posso te ajudar hoje?"
            },
            footer: {
                text: "Toque em Ver opções para escolher"
            },
            action: {
                button: "📋 Ver opções",
                sections: [
                    {
                        title: "Atendimento",
                        rows: [
                            {
                                id: "falar_atendente",
                                title: "👤 Falar com atendente",
                                description: "Falo direto com a Gislaine"
                            }
                        ]
                    },
                    {
                        title: "Serviços",
                        rows: [
                            {
                                id: "agendar_banho",
                                title: "🛁 Agendar banho ou tosa",
                                description: "Marcar horário pro pet"
                            },
                            {
                                id: "leva_traz",
                                title: "🚗 Leva-e-traz",
                                description: "Buscamos e trazemos"
                            }
                        ]
                    },
                    {
                        title: "Informações",
                        rows: [
                            {
                                id: "info_horario",
                                title: "🕐 Horário e endereço",
                                description: "Quando e onde estamos"
                            },
                            {
                                id: "info_pagamento",
                                title: "💳 Formas de pagamento",
                                description: "Como pagar"
                            }
                        ]
                    },
                    {
                        title: "Outras",
                        rows: [
                            {
                                id: "outra_duvida",
                                title: "❓ Outra dúvida",
                                description: "Tenho outra pergunta"
                            }
                        ]
                    }
                    
                ]
            }
        }
    };
    return sendToMeta(body);
}

module.exports = { sendWhatsAppMessage, sendMainMenu };