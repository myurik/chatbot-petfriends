// Gerenciador de estado da conversa
// Guarda em memória qual "etapa" cada usuário está no fluxo do bot.

// Estados possíveis (constantes exportadas pra evitar strings mágicas)

const STATES = {
    AGENDAMENTO_TRIAGEM: "AGENDAMENTO_TRIAGEM",
    AGENDAMENTO_ESCOLHA_SERVICO: "AGENDAMENTO_ESCOLHA_SERVICO"
};

// Map interno — chave: número do usuário; valor: estado atual
const conversationStates = new Map();

// Pega o estado atual do usuário (ou undefined se não tem)
function getState(from){
    return conversationStates.get(from);
}

// Define um estado pro usuário
function setState(from, state){
    conversationStates.set(from, state);
    console.log(`🔵 [STATE] ${from} → ${state}`);
}

// Remove o estado do usuário (volta pro fluxo padrão)
function clearState(from) {
    conversationStates.delete(from);
    console.log(`🔵 [STATE] ${from} → limpo`);
}

module.exports = {
    STATES,
    getState,
    setState,
    clearState
};