import { getValidToken, fetchAccessToken, saveTokenToDatabase } from "./tokenvalidation";
import { prisma } from "../src/prisma";
import { runTokenAutomation } from "../automacao/scheduler";

// Fluxo principal
(async function main() {
  try {
    // Configura a automação antes de executar o fluxo principal
    //console.log("Iniciando automação..."); usei para testes mas pode ser util
    await runTokenAutomation(); 

    // Verifica se há um token válido no banco de dados
    let tokenData = await getValidToken();

    if (!tokenData) {
      // Se não houver token válido, obtém um novo da API
      tokenData = await fetchAccessToken();
      if (tokenData) {
        await saveTokenToDatabase(tokenData);
      } else {
        console.error("Falha ao obter ou salvar o token.");
      }
    } else {
      console.log("Token reutilizado do banco de dados:", tokenData);
    }
  } catch (error) {
    console.error("Erro no fluxo principal:", error);
  } finally {
    await prisma.$disconnect();   
  }
})();
