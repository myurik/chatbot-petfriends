# Decisões de design e arquitetura

> Registro das principais decisões técnicas tomadas durante o desenvolvimento do chatbot. Cada decisão tem contexto e justificativa para garantir rastreabilidade.

---

## 1. WhatsApp Cloud API (oficial) em vez de soluções não-oficiais

**Decisão:** usar a WhatsApp Cloud API oficial da Meta, mesmo que envolva burocracia de verificação de negócio.

**Contexto:** existem soluções não-oficiais (Z-API, WPPConnect, Baileys) que são mais fáceis de configurar e gratuitas, mas não suportam botões interativos nem List Messages.

**Justificativa:**
- Botões interativos e List Messages são **essenciais para a acessibilidade dos clientes idosos** — esta foi uma preocupação central da proprietária.
- O free tier da Cloud API (1.000 conversas/mês) é mais que suficiente para o volume do Pet Friends (5–10 mensagens/dia).
- Solução oficial passa confiança ao cliente final.

**Trade-off aceito:** maior trabalho inicial de configuração (Meta Business Manager, verificação de número), em troca de uma experiência de usuário significativamente melhor.

---

## 2. Agendamento totalmente humano (Opção A superada pela "Opção 0")

**Decisão:** o chatbot coleta apenas até o tipo de serviço (banho/tosa). **Toda a marcação de dia e horário é feita pela Gislaine pessoalmente** após receber a notificação.

**Contexto:** considerei três opções:
- **Opção A** — bot coleta preferência de dia/período e Gislaine confirma o horário exato.
- **Opção B** — integração com Google Calendar (bot mostra horários disponíveis).
- **Opção C** — sistema próprio de agenda interna.

**Justificativa para a opção atual:** durante a reunião de 15/06/2026, a Gislaine explicou que cada pet tem particularidades que afetam o agendamento (ex.: golden agitado precisa de dia menos cheio; tosa estilizada precisa de horário com menos movimento). Mesmo a Opção A geraria fricção. Manter o agendamento 100% humano preserva o "toque pessoal" que diferencia o Pet Friends.

**Trade-off aceito:** o cliente não tem confirmação imediata, mas evita risco de overbook e mantém a qualidade do atendimento.

---

## 3. Cálculo automático do leva-e-traz

**Decisão:** integrar o chatbot à Google Maps Distance Matrix API para calcular a distância em quilômetros entre o endereço informado pelo cliente e a loja, aplicando automaticamente a fórmula da casa.

**Fórmula:** R$ 12,00 fixos até 3 km, mais R$ 1,00 por quilômetro adicional acima de 3 km.

**Justificativa:** a Gislaine não atende por bairro, mas por distância real. Calcular manualmente a cada pedido é trabalhoso. A automação aqui entrega valor real ao cliente (resposta instantânea) e à proprietária (uma tarefa repetitiva a menos).

**Contingência:** se o Google Maps não reconhecer o endereço, o bot oferece duas opções — revisar o endereço ou falar com atendente.

---

## 4. "Falar com atendente" como primeira opção do menu

**Decisão:** mover o botão de atendimento humano para a primeira posição do menu principal.

**Justificativa:** decisão direta da proprietária em 15/06/2026, pensando nos clientes idosos: "o caminho mais acessível deve ser o mais visível".

---

## 5. Tom acolhedor e triagem não-acusatória

**Decisão:** mensagens de boas-vindas calorosas, sem perguntas no primeiro contato; perguntas de triagem (pulga/carrapato, docilidade) apresentadas com explicação prévia do **porquê** das regras.

**Contexto:** a primeira versão da triagem propunha perguntas diretas logo após a saudação. A Gislaine considerou que o tom soava "agressivo" para clientes idosos.

**Justificativa:** experiências de chatbot que parecem interrogatório afastam o cliente — especialmente o idoso, que tende a abandonar a conversa. Redesenho prioriza acolhimento e colaboração.

---

## 6. Sem exibição de preços fixos

**Decisão:** o chatbot **nunca** exibe valores fixos de banho ou tosa.

**Justificativa:** valores variam por porte e tipo de pelagem. Mostrar uma "tabela" geraria ruído. Sempre que o cliente pergunta preço, o bot responde: *"Os valores variam de acordo com o porte e a pelagem do seu pet. Posso te conectar com a equipe pra te passar um orçamento personalizado?"*

---

## 7. Fallback múltiplo para atendimento humano

**Decisão:** garantir 8 caminhos diferentes para o cliente chegar à equipe humana sem fricção:
1. Botão "Falar com atendente" no menu principal
2. Botão "Tenho dúvida" durante a triagem
3. Palavras-chave detectadas no texto (atendente, humano, pessoa, ajuda, etc.)
4. Envio de áudio (encaminha direto)
5. Envio de imagem (encaminha direto)
6. Envio de sticker ou mídia (encaminha direto)
7. Mensagem fora do fluxo padrão (encaminha)
8. Inatividade prolongada (bot pergunta se quer chamar alguém)

**Justificativa:** acessibilidade real para clientes idosos exige redundância. Cada caminho cobre um perfil ou momento diferente.

---

## 8. Stack mínima — sem frameworks pesados

**Decisão:** Node.js + Express + SQLite, sem frameworks de chatbot (Botpress, Rasa, Dialogflow).

**Justificativa:** o escopo do projeto (5 fluxos principais, ~30 mensagens) não justifica a complexidade de um framework. State machine simples em código puro é mais transparente, mais fácil de auditar e mais leve para deploy em free tier de hospedagem.

---

## 9. LGPD — coleta mínima, finalidade clara, retenção limitada

**Decisão:** aplicar os princípios da LGPD desde o início:
- **Aviso de privacidade** no primeiro contato com cada cliente.
- **Coleta mínima**: apenas nome, telefone e dados básicos do pet (porte, tipo de serviço).
- **Finalidade explícita**: atendimento e organização de pré-agendamentos.
- **Retenção limitada**: dados de clientes inativos por mais de X meses serão descartados (período a ser definido com a proprietária na fase final).
- **Direito de exclusão**: cliente pode solicitar a qualquer momento.

**Justificativa:** atende ao critério ESG-Governance do planejamento e protege juridicamente tanto a loja quanto o aluno responsável pelo desenvolvimento.

---

## Histórico de validações

| Data | Etapa | Participantes | Resultado |
|------|-------|---------------|-----------|
| 28/05/2026 | Levantamento de requisitos | Matheus + Gislaine | Aceitação inicial; questionário entregue para análise |
| 01/06/2026 | Follow-up sobre dúvidas | Matheus + Gislaine (WhatsApp) | Discussão sobre preocupação com idosos |
| 15/06/2026 | Validação do design | Matheus + Gislaine | Termo de Aceite assinado; 3 mudanças solicitadas e absorvidas |
| 16/06/2026 | Coleta Termo de Imagem | Matheus + Gislaine | Termo assinado |
| 25/06/2026 | Avaliação do planejamento | Professor Juliano Sartori Langaro | **APROVADO** |
