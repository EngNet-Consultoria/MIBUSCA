import { getValidToken, fetchAccessToken, saveTokenToDatabase, delete_TokenInvalidos } from './tokenvalidation';
import { fetchStores, saveStoresToDatabase } from './lojas';
import { processOrders } from './vendas';

let executionCount = 0;

function logSuccess(message: string) {
  console.log(`\x1b[32m${message}\x1b[39m`);
}

function logError(message: string) {
  console.log(`\x1b[31m${message}\x1b[39m`);
}

async function main() {
  const currentTime = new Date().toISOString();
  executionCount++;

  try {
    console.log(`[Execução ${executionCount}] - Iniciando fluxo em ${currentTime}`);

    let tokenData = await getValidToken();

    if (!tokenData) {
      delete_TokenInvalidos();
      console.log(`[Execução ${executionCount}] - Nenhum token válido encontrado. Obtendo novo token...`);
      tokenData = await fetchAccessToken();

      if (tokenData) {
        logSuccess(`[Execução ${executionCount}] - Novo token obtido com sucesso. Salvando no banco de dados...`);
        await saveTokenToDatabase(tokenData);
      } else {
        logError(`[Execução ${executionCount}] - Falha ao obter o token da API. Encerrando fluxo.`);
        return;
      }
    } else {
      console.log(`[Execução ${executionCount}] - Token válido encontrado no banco de dados. Reutilizando...`);
    }

    console.log(`[Execução ${executionCount}] - Buscando lojas da API...`);
    const stores = await fetchStores(tokenData.accessToken);

    if (stores.length > 0) {
      logSuccess(`[Execução ${executionCount}] - ${stores.length} loja(s) encontrada(s). Salvando no banco de dados...`);

      for (const store of stores) {
        console.log(`[Execução ${executionCount}] - Salvando loja com ID: ${store.id}`);
      }

      await saveStoresToDatabase(stores);
      logSuccess(`[Execução ${executionCount}] - Lojas salvas com sucesso no banco de dados.`);
    } else {
      console.log(`[Execução ${executionCount}] - Nenhuma loja foi encontrada na API. Fluxo concluído.`);
    }

    console.log(`[Execução ${executionCount}] - Iniciando processamento de pedidos...`);

    // Processando pedidos de vendas
    await processOrders(tokenData.accessToken);

    logSuccess(`[Execução ${executionCount}] - Processamento de pedidos concluído.`);
  } catch (error) {
    logError(`[Execução ${executionCount}] - Erro no fluxo principal em ${currentTime}: ${error}`);
  }
}

// Executa o código pela primeira vez
main();

// Agende a execução do código a cada 30 minutos (1800000 milissegundos)
setInterval(main, 1800000);
