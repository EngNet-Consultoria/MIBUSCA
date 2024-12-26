import { prisma } from "../prisma";
import { z } from "zod";
import { ClientesSchema } from "../schemas/mibusca.schema";
//refiz o codigo usando consulta sql bruta com $queryRaw, o padrão com ORM estava me retornando muitos erros
// deixei bem explicito o que cada função faz, e adicionei comentarios para facilitar o entendimento

// Função para obter todos os clientes
export const getAllClientes = async () => {
  try {
    // Usamos $queryRaw para fazer uma consulta SQL diretamente no banco de dados
    // Isso pode contornar problemas com o mapeamento do modelo no schema.prisma
    const result = await prisma.$queryRaw<
      Array<{
        id_cliente: string;
        nome: string;
        email: string;
        telefone: string | null;
        status: boolean;
        id_loja: string;
        distancia_raio: number;
        tipo: number;
        data_ultima_compra: Date | null;
      }>
    >`
      SELECT * FROM clientes;  // A consulta retorna todos os dados da tabela clientes
    `;
    return result;
  } catch (error) {
    // Caso ocorra algum erro na consulta, é capturado e lançado um erro personalizado
    throw new Error(`Erro ao buscar todos os clientes: ${error.message}`);
  }
};

// Função para obter um cliente por ID
export const getClienteById = async (id_cliente: number) => {
  try {
    // Consulta SQL bruta para buscar um cliente específico pelo ID
    // Se o cliente não for encontrado, retorna um erro
    const result = await prisma.$queryRaw<
      Array<{
        id_cliente: string;
        nome: string;
        email: string;
        telefone: string | null;
        status: boolean;
        id_loja: string;
        distancia_raio: number;
        tipo: number;
        data_ultima_compra: Date | null;
      }>
    >`
      SELECT * FROM clientes WHERE id_cliente = ${id_cliente};  // A consulta retorna os dados do cliente pelo ID
    `;
    if (result.length === 0) {
      throw new Error("Cliente não encontrado");  
    }
    return result[0];  
  } catch (error) {
    throw new Error(`Erro ao buscar cliente por ID: ${error.message}`);
  }
};

// Função para criar um cliente
export const createCliente = async (data: z.infer<typeof ClientesSchema>) => {
  try {
    const validData = ClientesSchema.parse(data);  

    // Consulta SQL bruta para inserir um novo cliente no banco de dados
    await prisma.$executeRaw`
      INSERT INTO clientes (id_cliente, nome, email, telefone, status, id_loja, distancia_raio, tipo, data_ultima_compra)
      VALUES (
        ${validData.id_cliente}, ${validData.nome}, ${validData.email}, 
        ${validData.telefone}, ${validData.status}, ${validData.id_loja}, 
        ${validData.distancia_raio}, ${validData.tipo}, ${validData.data_ultima_compra}
      );
    `;
    return { message: "Cliente criado com sucesso" };  
  } catch (error) {
    throw new Error(`Erro ao criar cliente: ${error.message}`);
  }
};

// Função para atualizar um cliente
export const updateCliente = async (
  id_cliente: number,
  data: z.infer<typeof ClientesSchema>
) => {
  try {
    const validData = ClientesSchema.parse(data);  

    // Consulta SQL bruta para atualizar um cliente existente no banco de dados
    await prisma.$executeRaw`
      UPDATE clientes
      SET 
        nome = ${validData.nome},
        email = ${validData.email},
        telefone = ${validData.telefone},
        status = ${validData.status},
        id_loja = ${validData.id_loja},
        distancia_raio = ${validData.distancia_raio},
        tipo = ${validData.tipo},
        data_ultima_compra = ${validData.data_ultima_compra}
      WHERE id_cliente = ${id_cliente};  // Atualiza o cliente pelo ID
    `;
    return { message: "Cliente atualizado com sucesso" };  
  } catch (error) {
    throw new Error(`Erro ao atualizar cliente: ${error.message}`);
  }
};

// Função para deletar um cliente
export const deleteCliente = async (id_cliente: number) => {
  try {
    // Consulta SQL bruta para excluir um cliente pelo ID
    await prisma.$executeRaw`
      DELETE FROM clientes WHERE id_cliente = ${id_cliente};  // Deleta o cliente pelo ID
    `;
    return { message: "Cliente excluído com sucesso" };  
  } catch (error) {
    throw new Error(`Erro ao excluir cliente: ${error.message}`);
  }
};
