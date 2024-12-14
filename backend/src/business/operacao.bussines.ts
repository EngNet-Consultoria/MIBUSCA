import { prisma } from "../prisma";
import { z } from "zod";
import { OperacaoSchema } from "../schemas/mibusca.schema"; // Certifique-se de que o caminho esteja correto

// Função para obter todas as operações
export const getAllOperacoes = async () => {
  return await prisma.operacao.findMany();
};

// Função para obter uma operação específica por ID
export const getOperacaoById = async (id_operacao: number) => {
  const operacao = await prisma.operacao.findUnique({
    where: { id_operacao },
  });

  if (!operacao) {
    throw new Error("Operação não encontrada");
  }

  return operacao;
};

// Função para criar uma nova operação
export const createOperacao = async (data: z.infer<typeof OperacaoSchema>) => {
  const validData = OperacaoSchema.parse(data); // Valida os dados de entrada

  const operacao = await prisma.operacao.create({
    data: {
      id_loja: validData.id_loja,
      data_hora_inicio: validData.data_hora_inicio,
      data_hora_fim: validData.data_hora_fim || null, // Campo opcional
      cancelamentos: validData.cancelamentos || 0, // Definindo valor padrão para cancelamentos
      erros_plataforma: validData.erros_plataforma // Campo opcional
    },
  });

  return operacao;
};

// Função para atualizar uma operação existente
export const updateOperacao = async (
  id_operacao: number,
  data: z.infer<typeof OperacaoSchema>
) => {
  const validData = OperacaoSchema.parse(data); // Valida os dados de entrada

  const updatedOperacao = await prisma.operacao.update({
    where: { id_operacao },
    data: {
      id_loja: validData.id_loja,
      data_hora_inicio: validData.data_hora_inicio,
      data_hora_fim: validData.data_hora_fim || null, // Campo opcional
      cancelamentos: validData.cancelamentos || 0, // Definindo valor padrão para cancelamentos
      erros_plataforma: validData.erros_plataforma // Campo opcional
    },
  });

  return updatedOperacao;
};

// Função para deletar uma operação
export const deleteOperacao = async (id_operacao: number) => {
  return await prisma.operacao.delete({
    where: { id_operacao },
  });
};
