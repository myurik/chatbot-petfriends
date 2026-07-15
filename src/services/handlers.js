// Handler central de mensagens recebidas do WhatsApp
// Decide o que responder baseado no tipo e conteúdo da mensagem

const { 
    sendWhatsAppMessage, 
    sendMainMenu, 
    sendTriagemBanhoTosa,
    sendEscolhaServico,
    sendConfirmacaoAgendamento
} = require("./whatsapp");
const {STATES, getState, setState, clearState } = require("./state")
const { HORARIO_E_ENDERECO, FORMAS_DE_PAGAMENTO, OUTRA_DUVIDA } = require("./faq");

// Textos genéricos reutilizáveis — declarados como constantes
const HANDOFF_ATENDENTE = `Perfeito! 💜

Já estou passando aqui para Gislaine, ela vai te responder pessoalmente em instantes. Obrigado pela paciência! 🐾`;

const OPCAO_EM_CONSTRUCAO = `Ainda estou aprendendo essa opção 🐾

Enquanto isso, se quiser falar direto com a Gislaine, é só me responder aqui que já te encaminho pra ela!`;

const ID_DESCONHECIDO = `Opa, não entendi essa opção. Vou te passar pra Gislaine!`;

const TRIAGEM_DUVIDA_HANDOFF = `Sem problema! 💜

Vou te passar direto pra Gislaine — ela vai te ajudar com sua dúvida sobre agendamento pessoalmente.

Só me dá um instante que ela responde por aqui! 🐾`;

// Handler pra mensagens de texto = sempre mostra menu principal
async function handleTextMessage(from) {
    await sendMainMenu(from);
}

// Handler pra cliques no menu (list_reply)
async function handleListReply(from, selectedId) {
    // Caso especial: iniciar fluxo de agendamento (com estado)
    if(selectedId === "agendar_banho"){
        setState(from, STATES.AGENDAMENTO_TRIAGEM);
        await sendTriagemBanhoTosa(from);
        return;
    }
    
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
        case "leva_traz":
            responseText = OPCAO_EM_CONSTRUCAO;
            break;
        default:
            responseText = ID_DESCONHECIDO;
    }

    await sendWhatsAppMessage(from, responseText);
}

async function handleButtonReply(from, buttonId){
    const estadoAtual = getState(from);

    // TRIAGEM: cliente confirmou que pet está apto
    if (buttonId === "triagem_ok" && estadoAtual === STATES.AGENDAMENTO_TRIAGEM){
        setState(from, STATES.AGENDAMENTO_ESCOLHA_SERVICO);
        await sendEscolhaServico(from);
        return;
    }

    // TRIAGEM: cliente tem dúvida → handoff pra Gislaine
    if (buttonId === "triagem_duvida" && estadoAtual === STATES.AGENDAMENTO_TRIAGEM){
        clearState(from);
        await sendWhatsAppMessage(from, TRIAGEM_DUVIDA_HANDOFF);
        return;
    }

    // ESCOLHA DE SERVIÇO: qualquer um dos 3 (banho, tosa, banho+tosa)
    const servicoIds = ["servico_banho", "servico_tosa", "servico_banho_tosa"];
    if(servicoIds.includes(buttonId) && estadoAtual === STATES.AGENDAMENTO_ESCOLHA_SERVICO){
        clearState(from);
        await sendConfirmacaoAgendamento(from, buttonId);
        return;
    }

    // FALLBACK: clique fora de contexto (botão antigo, estado limpo, etc.)
    // Ex.: cliente clicou em botão de conversa antiga sem estado ativo
    await sendWhatsAppMessage(from, "Opa, não consegui entender essa opção agora. Vou te mostrar o menu de novo!");
    await sendMainMenu(from);
}

// Handler principal = recebe mensagem, decide qual handler específico chamar
async function handleIncomingMessage(message) {
    const from = message.from;

    if (message.type === "text") {
        return handleTextMessage(from);
    }

    if (message.type === "interactive") {
        const interactiveType = message.interactive?.type;

        if (interactiveType === "list_reply"){
            return handleListReply(from, message.interactive.list_reply.id);
        }
        
        if (interactiveType === "button_reply"){
            return handleButtonReply(from, message.interactive.button_reply.id);
        }
    }

}

module.exports = { handleIncomingMessage };