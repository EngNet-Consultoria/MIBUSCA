import { getValidToken, fetchAccessToken, saveTokenToDatabase } from './tokenvalidation';
import { fetchStores, saveStoresToDatabase } from './lojas';

async function main() {
  try {
    // Verifica se há um token válido no banco de dados
    let tokenData = await getValidToken();

    if (!tokenData) {
      console.log('Nenhum token válido encontrado, obtendo novo token...');
      tokenData = await fetchAccessToken();

      if (tokenData) {
        console.log('Novo token obtido com sucesso. Salvando no banco de dados...');
        await saveTokenToDatabase(tokenData);
      } else {
        console.error('Falha ao obter o token da API. Encerrando fluxo.');
        return;
      }
    } else {
      console.log('Token válido encontrado no banco de dados. Reutilizando...');
    }

    // Usa o token para buscar as lojas na API
    console.log('Buscando lojas da API...');
    const stores = await fetchStores(tokenData.accessToken);

    if (stores.length > 0) {
      console.log(`${stores.length} lojas encontradas. Salvando no banco de dados...`);
      await saveStoresToDatabase(stores);
      console.log('Lojas salvas com sucesso no banco de dados.');
    } else {
      console.log('Nenhuma loja foi encontrada na API. Fluxo concluído.');
    }
  } catch (error) {
    console.error('Erro no fluxo principal:', error);
  }
}

main();
