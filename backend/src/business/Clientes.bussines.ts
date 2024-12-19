// Clientes.business.ts
import { prisma } from "../prisma";
import { z } from "zod";
import { ClientesSchema } from "../schemas/mibusca.schema"; // Certifique-se de corrigir o caminho

// Função para obter todos os clientes
export const getAllClientes = async () => {
  return await prisma.clientes.findMany();
};

// Função para obter um cliente por ID
export const getClienteById = async (id_cliente: number) => {
  const cliente = await prisma.clientes.findUnique({
    where: { id_cliente },
  });

  if (!cliente) {
    throw new Error("Cliente não encontrado");
  }

  return cliente;
};

// Função para criar um cliente
export const createCliente = async (data: z.infer<typeof ClientesSchema>) => {
  const validData = ClientesSchema.parse(data); // Valida e transforma os dados

  const cliente = await prisma.clientes.create({
    data: {
      nome: validData.nome || null,
      id_loja: validData.id_loja,
      distancia_raio: validData.distancia_raio,
      tipo: validData.tipo,
      data_ultima_compra: validData.data_ultima_compra || null,
    },
  });

  return cliente;
};

// Função para atualizar um cliente
export const updateCliente = async (
  id_cliente: number,
  data: z.infer<typeof ClientesSchema>
) => {
  const validData = ClientesSchema.parse(data); // Valida e transforma os dados

  const updatedCliente = await prisma.clientes.update({
    where: { id_cliente },
    data: {
      nome: validData.nome || null,
      id_loja: validData.id_loja,
      distancia_raio: validData.distancia_raio,
      tipo: validData.tipo,
      data_ultima_compra: validData.data_ultima_compra || null,
    },
  });

  return updatedCliente;
};

// Função para deletar um cliente
export const deleteCliente = async (id_cliente: number) => {
  return await prisma.clientes.delete({
    where: { id_cliente },
  });
};
