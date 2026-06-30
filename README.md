# 🐾 Pet Friends Chatbot

> Chatbot conversacional de atendimento via WhatsApp para o **Pet Friends Pet Shop** — Atuba, Curitiba/PR.

Projeto desenvolvido como Prática Extensionista do curso Superior de Tecnologia em **Análise e Desenvolvimento de Sistemas (ADS)** da **PUCPR**, na modalidade **Prestação de Serviços** (100 horas).

---

## 📋 Sobre o projeto

O Pet Friends Pet Shop é um pequeno negócio de bairro tocado pela proprietária Gislaine M. dos Santos com o apoio de quatro funcionários. Toda a comunicação com clientes via WhatsApp é centralizada na proprietária, que acumula gestão operacional e atendimento. Hoje a loja utiliza apenas a mensagem nativa do WhatsApp Business (que apenas avisa, mas não filtra), o que ocasionalmente leva ao deslocamento perdido de tutores cujos pets estão fora das condições da loja.

Este chatbot foi desenhado para:

- **Aliviar a sobrecarga** de atendimento manual da proprietária absorvendo interações repetitivas (informações básicas, cálculo de leva-e-traz, triagem inicial);
- **Atender 24/7** dúvidas frequentes (horário, endereço, formas de pagamento), mesmo fora do expediente;
- **Reduzir os casos de pets fora das condições** (com pulga/carrapato, cão bravo) chegando à loja, por meio de uma pré-triagem conversacional respeitosa;
- **Calcular automaticamente** o valor do leva-e-traz a partir do endereço do cliente (Google Maps Distance Matrix);
- **Preservar o "toque pessoal"** do atendimento, encaminhando todo o agendamento de banho/tosa para a proprietária — que conhece as particularidades de cada pet;
- **Ser acessível para clientes idosos** — parcela significativa do público da loja — com botões interativos, múltiplos caminhos para atendente humano (botão, palavra-chave, áudio, imagem), e linguagem simples.

---

## 🛠️ Stack técnica

- **Runtime:** Node.js + Express
- **Banco de dados:** SQLite (com possibilidade de evoluir para Firebase Firestore)
- **Mensageria:** [WhatsApp Cloud API](https://developers.facebook.com/docs/whatsapp/cloud-api) (oficial, free tier de 1.000 conversas/mês)
- **Geolocalização:** [Google Maps Distance Matrix API](https://developers.google.com/maps/documentation/distance-matrix) (free tier de 28.500 consultas/mês)
- **Hospedagem:** Render free tier (ou Railway)
- **Versionamento:** GitHub

---

## 📂 Estrutura do projeto

```
chatbot-petfriends/
├── README.md                    # Este arquivo
├── .gitignore                   # Arquivos ignorados pelo Git
├── docs/
│   ├── design/
│   │   ├── fluxograma.md        # Fluxograma completo dos fluxos do chatbot
│   │   └── decisoes_tecnicas.md # Decisões de design e arquitetura
│   └── lgpd/
│       └── politica_privacidade.md  # Política LGPD (a redigir)
├── src/                         # (a criar) Código-fonte
│   ├── server.js                # Entry point
│   ├── routes/                  # Rotas Express
│   ├── handlers/                # Handlers de mensagens do WhatsApp
│   ├── flows/                   # Lógica dos fluxos conversacionais
│   │   ├── boasvindas.js
│   │   ├── menu.js
│   │   ├── agendamento.js
│   │   ├── levaetraz.js
│   │   ├── faq.js
│   │   └── handoff.js
│   ├── services/                # Integrações com APIs externas
│   │   ├── whatsapp.js
│   │   └── googlemaps.js
│   └── db/                      # Banco de dados (SQLite)
├── tests/                       # (a criar) Testes funcionais
└── package.json                 # (a criar) Dependências do Node
```

---

## 🤝 Sobre o projeto

| Item | Informação |
|------|------------|
| Aluno | **Matheus Yuri Franco Miguel** |
| Matrícula | 1112025106448 |
| Curso | Superior de Tecnologia em Análise e Desenvolvimento de Sistemas |
| Universidade | PUCPR |
| Professor-tutor | Juliano Sartori Langaro |
| Parceira | **Gislaine M. dos Santos** — Pet Friends Pet Shop |
| Endereço da loja | Av. Mal. Mascarenhas de Moraes, 1450 - Sala 2, Atuba, Curitiba/PR |
| Início do projeto | Maio de 2026 |
| Etapa de planejamento aprovada em | 25/06/2026 |

---

## 📜 Licença

Projeto acadêmico de Prática Extensionista. O código-fonte é disponibilizado para fins de evidência acadêmica e replicação por outros estudantes interessados em desenvolver soluções similares para pequenos negócios locais.
