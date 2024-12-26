import { prisma } from "../prisma";
import { z } from "zod";
import { Prisma } from "@prisma/client"; 
import { OperacaoSchema } from "../schemas/mibusca.schema";
//as explicações estão no arquivo de clientes.bussines.ts 

// Função para obter todas as operações
export const getAllOperacoes = async () => {
  try {
    const result = await prisma.$queryRaw<any[]>(Prisma.sql`SELECT * FROM operacao`);
    return result;
  } catch (error) {
    throw new Error(`Erro ao buscar todas as operações: ${error.message}`);
  }
};

// Função para obter uma operação específica por ID
export const getOperacaoById = async (id_operacao: number) => {
  try {
    const result = await prisma.$queryRaw<any[]>(
      Prisma.sql`SELECT * FROM operacao WHERE id_operacao = ${id_operacao}`
    );
    if (result.length === 0) {
      throw new Error("Operação não encontrada");
    }
    return result[0];
  } catch (error) {
    throw new Error(`Erro ao buscar operação por ID: ${error.message}`);
  }
};

// Função para criar uma nova operação
export const createOperacao = async (data: z.infer<typeof OperacaoSchema>) => {
  try {
    const validData = OperacaoSchema.parse(data);
    await prisma.$executeRaw(
      Prisma.sql`INSERT INTO operacao (id_loja, data_hora_inicio, data_hora_fim, cancelamentos, erros_plataforma)
      VALUES (${validData.id_loja}, ${validData.data_hora_inicio}, ${validData.data_hora_fim || null}, 
              ${validData.cancelamentos || 0}, ${validData.erros_plataforma || null})`
    );
    return { message: "Operação criada com sucesso" };
  } catch (error) {
    throw new Error(`Erro ao criar operação: ${error.message}`);
  }
};

// Função para atualizar uma operação existente
export const updateOperacao = async (
  id_operacao: number,
  data: z.infer<typeof OperacaoSchema>
) => {
  try {
    const validData = OperacaoSchema.parse(data);
    await prisma.$executeRaw(
      Prisma.sql`UPDATE operacao SET 
      id_loja = ${validData.id_loja}, 
      data_hora_inicio = ${validData.data_hora_inicio}, 
      data_hora_fim = ${validData.data_hora_fim || null}, 
      cancelamentos = ${validData.cancelamentos || 0}, 
      erros_plataforma = ${validData.erros_plataforma || null} 
      WHERE id_operacao = ${id_operacao}`
    );
    return { message: "Operação atualizada com sucesso" };
  } catch (error) {
    throw new Error(`Erro ao atualizar operação: ${error.message}`);
  }
};

// Função para deletar uma operação
export const deleteOperacao = async (id_operacao: number) => {
  try {
    await prisma.$executeRaw(
      Prisma.sql`DELETE FROM operacao WHERE id_operacao = ${id_operacao}`
    );
    return { message: "Operação deletada com sucesso" };
  } catch (error) {
    throw new Error(`Erro ao deletar operação: ${error.message}`);
  }
};
