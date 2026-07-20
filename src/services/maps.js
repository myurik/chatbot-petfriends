// Serviço de cálculo de distância e valor do leva-e-traz
// Google Maps Distance Matrix API para distância real de carro

const axios = require("axios");

// Endereço fixo do Pet Friends
const ORIGEM_PET_FRIENDS =
  "Av. Marechal Mascarenhas de Moraes, 1450, Atuba, Curitiba, PR, Brasil";

// Regra de Preço
const VALOR_MINIMO = 12.0; // R$ 12 até 3km
const KM_INCLUSOS = 3; // primeiros 3km são inclusos
const VALOR_KM_ADICIONAL = 1.0; // R$ 1 a cada km acima dos 3kms

// Calcula o valor baseado na distância
function calcularValor(distanciaKm) {
  if (distanciaKm <= KM_INCLUSOS) {
    return VALOR_MINIMO;
  }
  const kmExtras = distanciaKm - KM_INCLUSOS;
  return VALOR_MINIMO + kmExtras * VALOR_KM_ADICIONAL;
}

// Função Principal: consulta Google Maps + calcula valor
async function calcularDistanciaEValor(enderecoDestino){
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    if(!apiKey){
        console.error("❌ GOOGLE_MAPS_API_KEY não configurada no .env");
        return { erro: "config_faltando"};
    }

    const url = "https://maps.googleapis.com/maps/api/distancematrix/json";
    const params = {
        origins: ORIGEM_PET_FRIENDS,
        destinations: enderecoDestino,
        mode: "driving",
        units: "metric",
        language: "pt-BR",
        region: "br",
        key: apiKey 
    };

    try {
        const response = await axios.get(url, { params });
        const data = response.data;

        console.log("🗺️ [MAPS] Resposta:", JSON.stringify(data, null, 2));

        // Verifica status global da resposta
        if(data.status !== "OK"){
            console.error("", data.status);
            return { erro: "erro_api" };
        }

        //Verifica status do elemento específico (origem x destino)
        const element = data.rows?.[0]?.elements?.[0];
        if(!element || element.status !== "OK"){
            console.error("⚠️ [MAPS] Endereço não encontrado ou sem rota:", element?.status);
            return { erro: "endereco_nao_encontrado" };
        }

        //Extrai dados
        const distanciaMetros = element.distance.value;
        const distanciaKm = distanciaMetros / 1000;
        const valorTotal = calcularValor(distanciaKm);
        const enderecoFormatado = data.destination_addresses[0];

        return {
            distanciaKm: Math.round(distanciaKm * 10) / 10, // arredonda 1 casa decimal
            valor: valorTotal,
            enderecoFormatado: enderecoFormatado
        };
    } catch (error){
        console.error("❌ [MAPS] Erro na chamada:", error.response?.data || error.message);
        return { erro: "erro_api" };
    }
}

module.exports = {
    calcularDistanciaEValor
};
