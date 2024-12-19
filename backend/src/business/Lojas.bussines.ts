import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { LojasSchema } from '../schemas/mibusca.schema';

const prisma = new PrismaClient();

// Função para criar loja
export const criarLoja = async (data: z.infer<typeof LojasSchema>) => {
  // Validação dos dados usando Zod
  const validData = LojasSchema.parse(data);

  // Lógica para criar loja no banco de dados
  const loja = await prisma.lojas.create({
    data: {
      nome: validData.nome,
      status: validData.status,
      horario_operacao: validData.horario_operacao || null, // Permite null se não for fornecido
      data_criacao: validData.data_criacao || new Date(), // Define a data atual como fallback
      localizacao: validData.localizacao ? Buffer.from(validData.localizacao, 'base64') : null, // Converte Base64 para Buffer
    },
  });

  return loja;
};

// Função para atualizar loja
export const atualizarLoja = async (
  id_loja: number,
  data: z.infer<typeof LojasSchema>
) => {
  const validData = LojasSchema.parse(data);

  const updatedLoja = await prisma.lojas.update({
    where: { id_loja },
    data: {
      nome: validData.nome,
      status: validData.status,
      horario_operacao: validData.horario_operacao || null,
      localizacao: validData.localizacao ? Buffer.from(validData.localizacao, 'base64') : null,
    },
  });

  return updatedLoja;
};

// Função para obter todas as lojas
export const obterLojas = async () => {
  const lojas = await prisma.lojas.findMany();
  return lojas;
};

// Função para obter uma loja por ID
export const obterLojaPorId = async (id_loja: number) => {
  const loja = await prisma.lojas.findUnique({
    where: { id_loja },
  });

  if (!loja) {
    throw new Error('Loja não encontrada');
  }

  return loja;
};
