const axios = require('axios');

// Mapa de IDs → nome legível do serviço
const NOMES_SERVICOS = {
    servico_banho: "Banho",
    servico_tosa: "Tosa",
    servico_banho_tosa: "Banho + Tosa"
};

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

async function sendTriagemBanhoTosa(to){
    const body = {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: to,
        type: "interactive",
        interactive: {
            type: "button",
            body: {
                text: "Que legal! 🐾\n\nAntes de agendar, uma pergunta rápida pra segurança da equipe e dos outros pets:\n\n✅ Seu pet é dócil com pessoas e outros animais\n✅ Está livre de pulgas e carrapatos\n\nO seu pet está nessas condições?"
            },
            action: {
                buttons: [
                    {
                        type: "reply",
                        reply: {
                            id: "triagem_ok",
                            title: "✅ Sim, tudo certo"
                        }
                    },
                    {
                        type: "reply",
                        reply: {
                            id: "triagem_duvida",
                            title: "❓ Tenho dúvida"
                        }
                    }
                ]
            }
        }
    };
    return sendToMeta(body);
}

async function sendEscolhaServico(to){
    const body = {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: to,
        type: "interactive",
        interactive: {
            type: "button",
            body: {
                text: "Perfeito! 💜\n\nQual serviço você quer agendar?"
            },
            action: {
                buttons: [
                    {
                        type: "reply",
                        reply: {
                            id: "servico_banho",
                            title: "🛁 Banho"
                        }
                    },
                    {
                        type: "reply",
                        reply: {
                            id: "servico_tosa",
                            title: "✂️ Tosa"
                        }
                    },
                    {
                        type: "reply",
                        reply: {
                            id: "servico_banho_tosa",
                            title: "🛁 Banho + Tosa"
                        }
                    }
                ]
            }
        }
    };
    return sendToMeta(body);
}

async function sendConfirmacaoAgendamento(to, servicoId) {
    const nomeServico = NOMES_SERVICOS[servicoId] || "Serviço";

    const texto = `✅ *Solicitação recebida!*

📋 Serviço: *${nomeServico}*
🐾 Confirmado: pet dócil, sem pulga/carrapato

Vou te passar direto pra Gislaine agora — ela vai combinar dia e horário com você pessoalmente, escolhendo o melhor momento pro seu pet.

Em instantes ela responde por aqui! 💜🐾`;

    return sendWhatsAppMessage(to, texto);
}

async function sendPedidoEndereco(to){
    const texto = `🚗 *Leva-e-traz Pet Friends*

Buscamos e trazemos seu pet até a loja pra o banho ou tosa! 🐾

Pra calcular o valor, preciso saber onde você está.

📍 *Digite seu endereço completo*, com rua, número, bairro e cidade.

*Exemplo:*
Rua das Flores, 100, Centro, Curitiba`;

    return sendWhatsAppMessage(to, texto);
}

async function sendResumoLevaTraz(to, dados){
    // Formata valor R$ xx,xx
    const valorFormatado = dados.valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

    // Formata distância "8,5 km"
    const distanciaFormatada = dados.distanciaKm.toLocaleString("pt-BR") + " km";

    const texto = `🚗 *Leva-e-traz calculado!*

📍 *Endereço:*
${dados.enderecoFormatado}

📏 *Distância até a loja:* ${distanciaFormatada}
💰 *Valor:* ${valorFormatado}

*Como funciona:*
Buscamos seu pet no endereço, trazemos até a loja pra o serviço e depois levamos de volta pra casa. O valor já inclui a ida e volta.

Vou te passar direto pra Gislaine agora — ela combina o dia e horário com você. 💜🐾`;

    return sendWhatsAppMessage(to, texto);
}

module.exports = { 
    sendWhatsAppMessage, 
    sendMainMenu,
    sendTriagemBanhoTosa,
    sendEscolhaServico,
    sendConfirmacaoAgendamento,
    sendPedidoEndereco,
    sendResumoLevaTraz
};