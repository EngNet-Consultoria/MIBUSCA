import { prisma } from "../prisma";
import { z } from "zod";
import { VendasSchema } from "../schemas/mibusca.schema"; // Corrigir o caminho se necessário

// Função para obter todas as vendas
export const getAllVendas = async () => {
  return await prisma.vendas.findMany();
};

// Função para obter uma venda por ID
export const getVendaById = async (id_venda: number) => {
  const venda = await prisma.vendas.findUnique({
    where: { id_venda },
  });

  if (!venda) {
    throw new Error("Venda não encontrada");
  }

  return venda;
};

// Função para criar venda
export const createVenda = async (data: z.infer<typeof VendasSchema>) => {
  const validData = VendasSchema.parse(data); // Valida e transforma os dados

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
export const updateVenda = async (
  id_venda: number,
  data: z.infer<typeof VendasSchema>
) => {
  const validData = VendasSchema.parse(data); // Valida e transforma os dados

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

// Função para deletar venda
export const deleteVenda = async (id_venda: number) => {
  return await prisma.vendas.delete({
    where: { id_venda },
  });
};
