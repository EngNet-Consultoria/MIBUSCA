<<<<<<< HEAD
import { prisma } from "../prisma";
import { VendasSchema } from "../schemas/mibusca.schema"; 

export const getAllVendas = async () => {
    return await prisma.vendas.findMany();
};

export const getVendaById = async (id: number) => {
    return await prisma.vendas.findUnique({
        where: { id_venda: id }, 
    });
};

export const createVenda = async (data: any) => {
    const validData = VendasSchema.parse(data); // Valida e transforma os dados
    return await prisma.vendas.create({
        data: validData,
    });
};

export const updateVenda = async (id: number, data: any) => {
    const validData = VendasSchema.parse(data); // Valida e transforma os dados
    return await prisma.vendas.update({
        where: { id_venda: id }, 
        data: validData,
    });
};

export const deleteVenda = async (id: number) => {
    return await prisma.vendas.delete({
        where: { id_venda: id }, 
    });
=======
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { VendasSchema } from '../schemas/mibusca.schema'; // Corrigir o caminho se necessário

const prisma = new PrismaClient();

// Função para criar venda
export const criarVenda = async (data: z.infer<typeof VendasSchema>) => {
  // Validação dos dados usando Zod
  const validData = VendasSchema.parse(data);

  // Lógica para criar venda no banco de dados
  const venda = await prisma.vendas.create({
    data: {
      id_loja: validData.id_loja,
      data_hora: validData.data_hora,
      valor_total: validData.valor_total,
      ticket_medio: validData.ticket_medio || null,
      tipo_cliente: validData.tipo_cliente,
      cancelada: validData.cancelada || false,
      promocao_aplicada: validData.promocao_aplicada || false,
      roi: validData.roi || null,
    },
  });

  return venda;
};

// Função para atualizar venda
export const atualizarVenda = async (
  id_venda: number,
  data: z.infer<typeof VendasSchema>
) => {
  const validData = VendasSchema.parse(data);

  const updatedVenda = await prisma.vendas.update({
    where: { id_venda },
    data: {
      id_loja: validData.id_loja,
      data_hora: validData.data_hora,
      valor_total: validData.valor_total,
      ticket_medio: validData.ticket_medio || null,
      tipo_cliente: validData.tipo_cliente,
      cancelada: validData.cancelada || false,
      promocao_aplicada: validData.promocao_aplicada || false,
      roi: validData.roi || null,
    },
  });

  return updatedVenda;
};

// Função para obter todas as vendas
export const obterVendas = async () => {
  const vendas = await prisma.vendas.findMany();
  return vendas;
};

// Função para obter uma venda por ID
export const obterVendaPorId = async (id_venda: number) => {
  const venda = await prisma.vendas.findUnique({
    where: { id_venda },
  });

  if (!venda) {
    throw new Error('Venda não encontrada');
  }

  return venda;
>>>>>>> main
};
