import { prisma } from "../prisma";
import { z } from "zod";
import { VendasSchema } from "../schemas/mibusca.schema"; // Corrigir o caminho se necessário

// Tipagem explícita para o retorno das queries
type Venda = {
  id_venda: number;
  id_loja: number;
  data_hora: string;
  valor_total: number;
  ticket_medio: number | null;
  tipo_cliente: string;
  cancelada: boolean;
  promocao_aplicada: boolean;
};

// Função para obter todas as vendas
export const getAllVendas = async () => {
  try {
    const result = await prisma.$queryRaw<Venda[]>`
      SELECT * FROM vendas;
    `;
    return result;
  } catch (error) {
    throw new Error(`Erro ao buscar todas as vendas: ${error.message}`);
  }
};

// Função para obter uma venda por ID
export const getVendaById = async (id_venda: string) => {
  const id_venda_num = Number(id_venda);
  if (isNaN(id_venda_num)) {
    throw new Error("ID da venda inválido");
  }

  try {
    const result = await prisma.$queryRaw<Venda[]>`
      SELECT * FROM vendas WHERE id_venda = ${id_venda_num};
    `;

    if (result.length === 0) {
      throw new Error("Venda não encontrada");
    }

    return result[0]; // Retorna a primeira venda encontrada
  } catch (error) {
    throw new Error(`Erro ao buscar a venda: ${error.message}`);
  }
};

// Função para criar venda
export const createVenda = async (data: z.infer<typeof VendasSchema>) => {
  const validData = VendasSchema.parse(data); // Valida e transforma os dados

  const id_loja_num = Number(validData.id_loja);
  if (isNaN(id_loja_num)) {
    throw new Error("ID da loja inválido");
  }

  try {
    const result = await prisma.$queryRaw<Venda[]>`
      INSERT INTO vendas (
        id_loja, data_hora, valor_total, ticket_medio, tipo_cliente, cancelada, promocao_aplicada
      ) VALUES (
        ${id_loja_num}, ${validData.data_hora}, ${validData.valor_total}, 
        ${validData.ticket_medio || null}, ${validData.tipo_cliente}, 
        ${validData.cancelada || false}, ${validData.promocao_aplicada || false}
      ) RETURNING *;
    `;

    return result[0]; // Retorna a venda criada
  } catch (error) {
    throw new Error(`Erro ao criar venda: ${error.message}`);
  }
};

// Função para atualizar venda
export const updateVenda = async (
  id_venda: string,
  data: z.infer<typeof VendasSchema>
) => {
  const validData = VendasSchema.parse(data); // Valida e transforma os dados

  const id_venda_num = Number(id_venda);
  if (isNaN(id_venda_num)) {
    throw new Error("ID da venda inválido");
  }

  const id_loja_num = Number(validData.id_loja);
  if (isNaN(id_loja_num)) {
    throw new Error("ID da loja inválido");
  }

  try {
    const result = await prisma.$queryRaw<Venda[]>`
      UPDATE vendas SET
        id_loja = ${id_loja_num},
        data_hora = ${validData.data_hora},
        valor_total = ${validData.valor_total},
        ticket_medio = ${validData.ticket_medio || null},
        tipo_cliente = ${validData.tipo_cliente},
        cancelada = ${validData.cancelada || false},
        promocao_aplicada = ${validData.promocao_aplicada || false}
      WHERE id_venda = ${id_venda_num} RETURNING *;
    `;

    if (result.length === 0) {
      throw new Error("Venda não encontrada");
    }

    return result[0]; // Retorna a venda atualizada
  } catch (error) {
    throw new Error(`Erro ao atualizar venda: ${error.message}`);
  }
};

// Função para deletar venda
export const deleteVenda = async (id_venda: string) => {
  const id_venda_num = Number(id_venda);
  if (isNaN(id_venda_num)) {
    throw new Error("ID da venda inválido");
  }

  try {
    const result = await prisma.$queryRaw<Venda[]>`
      DELETE FROM vendas WHERE id_venda = ${id_venda_num} RETURNING *;
    `;

    if (result.length === 0) {
      throw new Error("Venda não encontrada");
    }

    return result[0]; // Retorna a venda deletada
  } catch (error) {
    throw new Error(`Erro ao deletar venda: ${error.message}`);
  }
};
