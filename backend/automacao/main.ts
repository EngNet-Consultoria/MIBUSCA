import { getValidToken, fetchAccessToken, saveTokenToDatabase } from './tokenvalidation';

// Fluxo principal
(async function main() {
  // Verifica se há um token válido no banco de dados
  let tokenData = await getValidToken();

  if (!tokenData) {
    // Se não houver token válido, obtém um novo da API
    tokenData = await fetchAccessToken();
    if (tokenData) {
      await saveTokenToDatabase(tokenData);
    } else {
      console.error('Falha ao obter ou salvar o token.');
    }
  } else {
    console.log('Token reutilizado do banco de dados:', tokenData);
  }
})();
