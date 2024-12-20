import axios from 'axios';
import qs from 'qs';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// Carregar as variáveis de ambiente
dotenv.config({ path: '../.env' });

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

// Função para verificar se um token válido já existe no banco de dados
export async function getValidToken(): Promise<TokenData | null> {
  try {
    const connection = await mysql.createConnection(dbConfig);

    const query = `
      SELECT access_token AS accessToken, token_expiration AS expirationDate
      FROM token_validation
      WHERE client_id = ? AND client_secret = ? AND token_expiration > NOW()
      LIMIT 1
    `;

    const [rows] = await connection.execute(query, [CLIENT_ID, CLIENT_SECRET]);
    await connection.end();

    if (Array.isArray(rows) && rows.length > 0) {
      console.log('Token válido encontrado no banco de dados');
      return rows[0] as TokenData;
    } else {
      console.log('Nenhum token válido encontrado no banco de dados.');
      return null;
    }
  } catch (error) {
    console.error('Erro ao verificar o token no banco de dados:', (error as Error).message);
    return null;
  }
}

// Função para obter o token da API
export async function fetchAccessToken(): Promise<TokenData | null> {
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
        .slice(0, 19) // Formato TIMESTAMP
        .replace('T', ' '); // Formato TIMESTAMP
      console.log('Token obtido com sucesso:');
      return { accessToken, expirationDate };
    } else {
      console.error('Erro ao obter o token:', response.statusText);
      return null;
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Exibe detalhes sobre o erro no Axios
      console.error('Erro na requisição:', error.response?.data || error.message);
    } else {
      console.error('Erro desconhecido:', (error as Error).message);
    }
    return null;
  }
}

// Função para salvar ou atualizar o token no banco de dados
export async function saveTokenToDatabase(tokenData: TokenData) {
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
