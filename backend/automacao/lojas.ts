import axios from 'axios';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// Carregar variáveis de ambiente
dotenv.config({ path: '../.env' });

const API_URL = 'https://merchant-api.ifood.com.br/merchant/v1.0/merchants';
const API_URL_DETAIL = 'https://merchant-api.ifood.com.br/merchant/v1.0/merchants/';

const DATABASE_URL = process.env.DATABASE_URL || '';

if (!DATABASE_URL) {
  throw new Error('A variável de ambiente DATABASE_URL deve estar configurada.');
}

// Função para processar a URL do banco de dados
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

const dbConfig = parseDatabaseUrl(DATABASE_URL);

// Definir o tipo da loja com base na estrutura dos dados da API
interface Store {
  id: string;
  name: string;
  corporateName: string;
  status?: string;
  operatingHours?: string;
  createdAt?: string; // Adicionando createdAt ao tipo Store
  address?: {
    country?: string;
    state?: string;
    city?: string;
    district?: string;
    street?: string;
    number?: string;
    postalCode?: string;
    latitude?: number;
    longitude?: number;
  };
}

// Definir o tipo para os detalhes da loja
interface StoreDetails {
  averageTicket?: number;
  exclusive?: boolean;
  type?: string;
  createdAt?: string; // A data de criação agora é um campo string, representando a data
  address?: {
    country?: string;
    state?: string;
    city?: string;
    district?: string;
    street?: string;
    number?: string;
    postalCode?: string;
    latitude?: number;
    longitude?: number;
  };
  operations?: Array<{
    name?: string;
    salesChannels?: Array<{ name?: string; enabled?: boolean }>;
  }>;
  test?: string;
  [key: string]: any;
}

// Mapeamento de status
const statusMap: { [key: string]: number } = {
  AVAILABLE: 0,  // Aberta
  UNAVAILABLE: 1,  // Fechada por erro
  PENDING: 2,  // Fora do horário
};

// Função para buscar lojas da API
export async function fetchStores(token: string): Promise<Store[]> {
  try {
    const response = await axios.get(`${API_URL}?page=1&size=100`, {
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      console.log('Lojas obtidas com sucesso da API.');

      const stores: Store[] = response.data || [];
      const detailedStores: (Store & StoreDetails)[] = [];

      for (const store of stores) {
        const storeDetails = await fetchStoreDetails(store.id, token);

        const detailedStore = Object.assign({}, store, storeDetails || {});
        detailedStores.push(detailedStore);
      }

      return detailedStores;
    } else {
      console.error('Erro ao buscar lojas da API:', response.statusText);
      return [];
    }
  } catch (error) {
    console.error('Erro na requisição:', error);
    return [];
  }
}

// Função para buscar os detalhes de cada loja usando o ID
async function fetchStoreDetails(storeId: string, token: string): Promise<StoreDetails> {
  try {
    const response = await axios.get(`${API_URL_DETAIL}${storeId}`, {
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      console.log(`Detalhes da loja ${storeId} obtidos com sucesso.`);
      return response.data || {};
    } else {
      console.error(`Erro ao buscar detalhes da loja ${storeId}:`, response.statusText);
      return {};
    }
  } catch (error) {
    console.error('Erro desconhecido:', error);
    return {};
  }
}

// Função para formatar a data para o formato YYYY-MM-DD
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Meses começam em 0
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Função para salvar lojas no banco de dados
export async function saveStoresToDatabase(stores: Store[]) {
  try {
    const connection = await mysql.createConnection(dbConfig);

    const query = `
      INSERT INTO lojas (id_loja, nome, status, horario_operacao, data_criacao, localizacao)
      VALUES (?, ?, ?, ?, ?, POINT(?, ?))
      ON DUPLICATE KEY UPDATE
        nome = VALUES(nome),
        status = VALUES(status),
        horario_operacao = VALUES(horario_operacao), 
        localizacao = VALUES(localizacao)
    `;

    for (const store of stores) {
      const { id, name, status, operatingHours, address, createdAt } = store;

      // Validar status
      const validStatus = statusMap[status || 'PENDING'] || statusMap.PENDING;

      // Formatar a data de criação
      const creationDate = createdAt ? formatDate(createdAt) : null;

      // Verificar se latitude e longitude estão presentes
      const latitude = address?.latitude;
      const longitude = address?.longitude;

      // Se latitude e longitude existirem, inserir como POINT
      if (latitude !== undefined && longitude !== undefined) {
        await connection.execute(query, [
          id,
          name,
          validStatus,
          operatingHours || null,
          creationDate,
          latitude,
          longitude,
        ]);
      } else {
        console.log(`Coordenadas não encontradas para a loja ${id}, não salvando a localização.`);
        await connection.execute(query, [
          id,
          name,
          validStatus,
          operatingHours || null,
          creationDate,
          null,
          null,
        ]);
      }
    }

    console.log('Lojas salvas no banco de dados com sucesso!');
    await connection.end();
  } catch (error) {
    console.error('Erro ao salvar lojas no banco de dados:', error);
  }
}
