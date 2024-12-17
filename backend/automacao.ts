import axios from 'axios';
import qs from 'qs';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// Carregar as variáveis de ambiente
dotenv.config();

// Configuração do endpoint e credenciais
const API_URL = 'https://merchant-api.ifood.com.br/authentication/v1.0/oauth/token';
const CLIENT_ID = process.env.CLIENT_ID || ''; // Configure no .env
const CLIENT_SECRET = process.env.CLIENT_SECRET || ''; // Configure no .env

if (!CLIENT_ID || !CLIENT_SECRET) {
  throw new Error('As variáveis CLIENT_ID e CLIENT_SECRET devem estar definidas no .env');
}

// Interface para os dados do token
interface TokenData {
  accessToken: string;
  expirationDate: string; // Alterado para string
}

// Função para obter as configurações do banco a partir do DATABASE_URL
function parseDatabaseUrl(databaseUrl: string) {
  const regex = /mysql:\/\/(.*?):(.*?)@(.*?):(\d+)\/(.*)/;
  const matches = databaseUrl.match(regex);
  if (!matches) throw new Error('Formato inválido para DATABASE_URL');

  return {
    user: matches[1],
    password: matches[2],
    host: matches[3],
    port: Number(matches[4]),
    database: matches[5],
  };
}

// Obter configuração do banco de dados
const dbConfig = parseDatabaseUrl(process.env.DATABASE_URL!);

// Função para obter o token
async function fetchAccessToken(): Promise<TokenData | null> {
  try {
    const data = qs.stringify({
      grantType: 'client_credentials',
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
    });

    const response = await axios.post(API_URL, data, {
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    if (response.status === 200) {
      const { accessToken, expiresIn } = response.data;
      const expirationDate = new Date(Date.now() + expiresIn * 1000)
        .toISOString()
        .slice(0, 19)
        .replace('T', ' '); // Formato TIMESTAMP
      console.log('Token obtido com sucesso:', accessToken);
      return { accessToken, expirationDate }; // Retorna `expirationDate` como string
    } else {
      console.error('Erro ao obter o token:', response.statusText);
      return null;
    }
  } catch (error) {
    console.error('Erro na requisição:', (error as Error).message);
    return null;
  }
}

// Função para salvar ou atualizar o token no banco de dados
async function saveTokenToDatabase(tokenData: TokenData) {
  try {
    const connection = await mysql.createConnection(dbConfig);

    const query = `
      INSERT INTO token_validation (
        client_id, 
        client_secret, 
        access_token, 
        token_expiration, 
        refresh_token, 
        authorization_code, 
        auth_verification_code, 
        verification_url, 
        verification_url_full
      ) VALUES (?, ?, ?, ?, '', '', '', '', '')
      ON DUPLICATE KEY UPDATE
        access_token = VALUES(access_token),
        token_expiration = VALUES(token_expiration)
    `;

    await connection.execute(query, [
      CLIENT_ID,
      CLIENT_SECRET,
      tokenData.accessToken,
      tokenData.expirationDate, // Diretamente como string formatada
    ]);

    console.log('Token salvo no banco de dados com sucesso!');
    await connection.end();
  } catch (error) {
    console.error('Erro ao salvar o token no banco de dados:', (error as Error).message);
  }
}

// Fluxo principal
(async function main() {
  const tokenData = await fetchAccessToken();
  if (tokenData) {
    await saveTokenToDatabase(tokenData);
  } else {
    console.error('Falha ao obter ou salvar o token.');
  }
})();
