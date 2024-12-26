import cron from "node-cron";
// pelo o que eu li node cron é o mais eficiente e nao deu erro nos meus testes
// pra usar npm run start-scheduler
// eu teste bree mas nao consegui entender a documentacao e node-schedule mas nao eh robusto

import { getValidToken, fetchAccessToken, saveTokenToDatabase } from "./tokenvalidation";
import { prisma } from "../src/prisma";

// Função principal para validar e renovar o token
async function runTokenAutomation() {
  try {
    // Tenta obter um token válido do banco de dados
    let tokenData = await getValidToken();

    if (!tokenData) {
      // Se nenhum token válido for encontrado, obtém um novo
      tokenData = await fetchAccessToken();
      if (tokenData) {
        // Salva o novo token no banco de dados
        await saveTokenToDatabase(tokenData);
      } else {
        console.error("Falha ao obter ou salvar o token.");
      }
    } else {
      console.log("Token reutilizado do banco de dados:", tokenData);
    }
  } catch (error) {
    console.error("Erro na automação do token:", error);
  } finally {
    // Certifica-se de desconectar o Prisma ao final do processo
    await prisma.$disconnect();
  }
}

// Configurar o agendamento
cron.schedule("0 * * * *", async () => {
  console.log("Executando automação de token:", new Date().toISOString());
  await runTokenAutomation(); // Executa o fluxo de validação e renovação do token
});

// Exportar para uso em outros arquivos, caso necessário
export { runTokenAutomation };
