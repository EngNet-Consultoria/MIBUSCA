import { getValidToken, fetchAccessToken, saveTokenToDatabase } from './tokenvalidation';
import { fetchStores, saveStoresToDatabase } from './lojas';
import { createVenda } from './vendas'; // Importa a função para criar vendas

let executionCount = 0; // Contador para o número de execuções

// Função para logar mensagens em verde (sucesso)
function logSuccess(message: string) {
  console.log(`\x1b[32m${message}\x1b[39m`); // Mensagens em verde
}

// Função para logar mensagens de erro em vermelho
function logError(message: string) {
  console.log(`\x1b[31m${message}\x1b[39m`); // Mensagens em vermelho
}

async function main() {
  const currentTime = new Date().toISOString(); // Data e hora atual em formato ISO
  executionCount++; // Incrementa o contador de execuções

  try {
    console.log(`[Execução ${executionCount}] - Iniciando fluxo em ${currentTime}`);

    // Verifica se há um token válido no banco de dados
    let tokenData = await getValidToken();

    if (!tokenData) {
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

    // Usa o token para buscar as lojas na API
    console.log(`[Execução ${executionCount}] - Buscando lojas da API...`);
    const stores = await fetchStores(tokenData.accessToken);

    if (stores.length > 0) {
      logSuccess(`[Execução ${executionCount}] - ${stores.length} loja(s) encontrada(s). Salvando no banco de dados...`);

      // Logando o ID de cada loja enquanto salva
      for (const store of stores) {
        console.log(`[Execução ${executionCount}] - Salvando loja com ID: ${store.id}`);
      }

      await saveStoresToDatabase(stores);
      logSuccess(`[Execução ${executionCount}] - Lojas salvas com sucesso no banco de dados.`);

      // Automação de vendas
      console.log(`[Execução ${executionCount}] - Iniciando automação de vendas...`);
      for (const store of stores) {
        const vendaData = {
          id_venda: `venda-${Date.now()}`, // Gera um ID único para a venda
          id_loja: store.id,
          id_cliente: `cliente-${Math.random().toString(36).substring(7)}`, // Gera um ID aleatório para o cliente
          distancia_raio: Math.random() * 10, // Simula uma distância
          data_hora: new Date(), // Usa a data atual
          valor_total: Math.random() * 1000, // Simula um valor total
          ticket_medio: Math.random() * 500, // Simula um ticket médio
          tipo_cliente: Math.floor(Math.random() * 3), // Simula o tipo de cliente (0, 1 ou 2)
          cancelada: false,
          promocao_aplicada: Math.random() < 0.5, // Simula se a promoção foi aplicada
          cancelamentos: 0,
          erros_plataforma: 0,
        };

        try {
          const createdVenda = await createVenda(vendaData);
          logSuccess(`[Execução ${executionCount}] - Venda criada com sucesso: ID ${createdVenda.id_venda}`);
        } catch (error) {
          logError(`[Execução ${executionCount}] - Erro ao criar venda para a loja ${store.id}: ${error}`);
        }
      }
    } else {
      console.log(`[Execução ${executionCount}] - Nenhuma loja foi encontrada na API. Fluxo concluído.`);
    }
  } catch (error) {
    logError(`[Execução ${executionCount}] - Erro no fluxo principal em ${currentTime}: ${error}`);
  }
}

// Executa o código pela primeira vez
main();

// Agende a execução do código a cada 10 segundos (10000 milissegundos) - ajustar para 30 minutos se necessário
setInterval(main, 10000); // Alterar para 1800000 para 30 minutos
