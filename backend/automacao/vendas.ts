import axios from 'axios';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// Carregar variáveis de ambiente
dotenv.config();

// Configuração do banco de dados
const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
  throw new Error('A variável DATABASE_URL não está definida no arquivo .env');
}

function parseDatabaseUrl(databaseUrl: string) {
  const url = new URL(databaseUrl);
  return {
    host: url.hostname,
    user: url.username,
    password: url.password,
    database: url.pathname.split('/')[1],
  };
}

const dbConfig = parseDatabaseUrl(dbUrl);

// Configurações da API
const pollingUrl = 'https://merchant-api.ifood.com.br/events/v1.0/events:polling?types=PLC%2CREC%2CCFM&groups=ORDER_STATUS%2CDELIVERY&categories=FOOD%2CGROCERY%2CFOOD_SELF_SERVICE';
const orderUrl = 'https://merchant-api.ifood.com.br/order/v1.0/orders/';
const APILOJAS = "http://localhost:8080/lojas/"

// Definição do tipo de Pedido
interface Pedido {
  code: string;
  orderId: string;
}

async function verificarVendaExistente(connection: mysql.Connection, idCliente: string): Promise<boolean> {
  console.log(`Verificando se a venda existe para o cliente com id: ${idCliente}`);
  const query = 'SELECT COUNT(*) as count FROM vendas WHERE id_cliente = ?';
  const [rows] = await connection.execute(query, [idCliente]);
  const count = (rows as any)[0].count;
  console.log(`Venda existente para o cliente ${idCliente}: ${count > 0}`);
  return count > 0;
}

async function fetchOrderDetails(accessToken: string, orderId: string, cancelamento: number) {
  console.log(`Buscando detalhes do pedido ${orderId} no endpoint: ${orderUrl}${orderId}`);
  const url = orderUrl + orderId;

  let connection: mysql.Connection | undefined;

  try {
    connection = await mysql.createConnection(dbConfig);
    console.log(`Conectado ao banco de dados para o pedido ${orderId}`);

    const response = await axios.get(url, {
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // Log da resposta da requisição
    console.log(`Resposta recebida para o pedido ${orderId}:`, JSON.stringify(response.data, null, 2));

    const DetalhesPedido = response.data;
    const Id_venda = DetalhesPedido.id;
    const Id_cliente = DetalhesPedido.customer.id;
    const Id_loja = DetalhesPedido.merchant.id;

    const distancia_raio = 0;

    const data_hora = new Date(DetalhesPedido.createdAt); 

    const taxa_entrega = DetalhesPedido.total.deliveryFee;
    const promocao = DetalhesPedido.total.benefits; 
    const totalPedido = DetalhesPedido.total.subTotal;
    const totalgeral = DetalhesPedido.total.orderAmount; 

    const clienteExiste = await verificarVendaExistente(connection, Id_cliente);
    const tipo_cliente = clienteExiste ? 1 : 0;

    console.log(`Detalhes do pedido:
      Id_venda: ${Id_venda}
      Id_cliente: ${Id_cliente}
      Id_loja: ${Id_loja}
      Distância_raio: ${distancia_raio}
      Data_hora: ${data_hora}
      Cancelamentos: ${cancelamento}
      TotalEntrega: ${taxa_entrega}
      Total do Pedido: ${totalPedido}
      Tipo Cliente: ${tipo_cliente}`);

    const insertQuery = `
      INSERT INTO Vendas (id_venda, id_cliente, id_loja, distancia_raio, data_hora, cancelada, tipo_cliente, taxa_entrega, total_pedido)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await connection.execute(insertQuery, [
      Id_venda,
      Id_cliente,
      Id_loja,
      distancia_raio,
      data_hora,
      cancelamento,
      tipo_cliente,
      taxa_entrega,
      totalPedido,
    ]);
    console.log(`Pedido ${Id_venda} inserido com sucesso no banco de dados`);

    return DetalhesPedido;
  } catch (error) {
    console.error('Erro ao buscar detalhes do pedido:', error.response?.data || error.message);
    return null;
  } finally {
    if (connection) {
      await connection.end();
      console.log(`Conexão com o banco de dados encerrada para o pedido ${orderId}`);
    }
  }
}

async function fetchOrders(accessToken: string) {
  console.log('Iniciando o processo de polling para obter pedidos no endpoint:', pollingUrl);
  try {
    const response = await axios.get(pollingUrl, {
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // Log da resposta do polling

    const pedidos: Pedido[] = response.data || [];

    for (const pedido of pedidos) {
      if ((pedido.code === 'CAN' || pedido.code === 'CON')) {
        const cancelamento = pedido.code === 'CAN' ? 1 : 0;
        console.log(`Pedido encontrado: ${pedido.orderId}, tipo: ${pedido.code}`);
        await fetchOrderDetails(accessToken, pedido.orderId, cancelamento);
      }
    }
  } catch (error) {
    console.error('Erro ao buscar pedidos do polling:', error.response?.data || error.message);
  }
}

export async function processOrders(accessToken: string) {
  console.log('Iniciando o processamento dos pedidos...');
  try {
    await fetchOrders(accessToken);
    console.log('Processamento de pedidos concluído com sucesso');
  } catch (error) {
    console.error('Erro na execução da automação:', error.message);
  }
}
