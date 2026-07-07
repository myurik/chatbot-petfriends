// Handler central de mensagens recebidas do WhatsApp
// Decide o que responder baseado no tipo e conteúdo da mensagem

const { sendWhatsAppMessage, sendMainMenu } = require("./whatsapp");
const { HORARIO_E_ENDERECO, FORMAS_DE_PAGAMENTO, OUTRA_DUVIDA } = require("./faq");

// Textos genéricos reutilizáveis — declarados como constantes
const HANDOFF_ATENDENTE = `Perfeito! 💜

Já estou passando aqui para Gislaine, ela vai te responder pessoalmente em instantes. Obrigado pela paciência! 🐾`;

const OPCAO_EM_CONSTRUCAO = `Ainda estou aprendendo essa opção 🐾

Enquanto isso, se quiser falar direto com a Gislaine, é só me responder aqui que já te encaminho pra ela!`;

const ID_DESCONHECIDO = `Opa, não entendi essa opção. Vou te passar pra Gislaine!`;

// Handler pra mensagens de texto = sempre mostra menu principal
async function handleTextMessage(from) {
    await sendMainMenu(from);
}

// Handler pra cliques no menu (list_reply)
async function handleListReply(from, selectedId) {
    let responseText;

    switch (selectedId) {
        case "falar_atendente":
            responseText = HANDOFF_ATENDENTE;
            break;
        case "info_horario":
            responseText = HORARIO_E_ENDERECO;
            break;
        case "info_pagamento":
            responseText = FORMAS_DE_PAGAMENTO;
            break;
        case "outra_duvida":
            responseText = OUTRA_DUVIDA;
            break;
        case "agendar_banho":
        case "leva_traz":
            responseText = OPCAO_EM_CONSTRUCAO;
            break;
        default:
            responseText = ID_DESCONHECIDO;
    }

    await sendWhatsAppMessage(from, responseText);
}

// Handler principal = recebe mensagem, decide qual handler específico chamar
async function handleIncomingMessage(message) {
    const from = message.from;

    if (message.type === "text") {
        return handleTextMessage(from);
    }

    if (message.type === "interactive" && message.interactive?.type === "list_reply") {
        return handleListReply(from, message.interactive.list_reply.id);
    }

}

module.exports = { handleIncomingMessage };