import { PrismaClient } from "@prisma/client";
import { Lojas } from "../schemas/mibusca.schema";

const prisma = new PrismaClient();

// Tipo da loja
type LojaComCoordenadas = {
  id_loja: string;
  nome: string;
  status: number;
  data_criacao: string | null;
  localizacao: Buffer | null;
  latitude: number | null;
  longitude: number | null;
};

// Função para obter todas as lojas
export const getLojas = async (): Promise<LojaComCoordenadas[]> => {
  try {
    const lojas = await prisma.lojas.findMany();

    return lojas.map(({ localizacao, data_criacao, id_loja, ...resto }) => {
      const latitude = localizacao ? localizacao.readDoubleLE(0) : null;
      const longitude = localizacao ? localizacao.readDoubleLE(8) : null;
      return {
        ...resto,
        id_loja: String(id_loja),
        data_criacao: data_criacao ? new Date(data_criacao).toISOString() : null,
        latitude,
        longitude,
        localizacao
      };
    });
  } catch (error) {
    throw new Error(`Erro ao obter lojas: ${error.message}`);
  }
};

// Função para obter uma loja específica pelo ID
export const getLojaById = async (id_loja: string): Promise<LojaComCoordenadas | null> => {
  try {
    const loja = await prisma.lojas.findUnique({
      where: { id_loja: String(id_loja) }, // Garantindo que id_loja seja uma string
    });

    if (!loja) {
      throw new Error("Loja não encontrada");
    }

    const latitude = loja.localizacao ? loja.localizacao.readDoubleLE(0) : null;
    const longitude = loja.localizacao ? loja.localizacao.readDoubleLE(8) : null;

    return {
      ...loja,
      id_loja: String(loja.id_loja),
      data_criacao: loja.data_criacao ? new Date(loja.data_criacao).toISOString() : null,
      latitude,
      longitude,
      localizacao: loja.localizacao
    };
  } catch (error) {
    throw new Error(`Erro ao obter loja: ${error.message}`);
  }
};

// Função para criar uma nova loja
export const createLoja = async (data: Lojas): Promise<LojaComCoordenadas> => {
  try {
    const loja = await prisma.lojas.create({
      data: {
        ...data,
        localizacao: data.localizacao ? Buffer.from(data.localizacao) : null,
      },
    });

    const latitude = loja.localizacao ? loja.localizacao.readDoubleLE(0) : null;
    const longitude = loja.localizacao ? loja.localizacao.readDoubleLE(8) : null;

    return {
      ...loja,
      id_loja: String(loja.id_loja),
      latitude,
      longitude,
      data_criacao: loja.data_criacao ? new Date(loja.data_criacao).toISOString() : null,
      localizacao: loja.localizacao
    };
  } catch (error) {
    throw new Error(`Erro ao criar loja: ${error.message}`);
  }
};

// Função para atualizar uma loja
export const updateLoja = async (id_loja: string, data: Partial<Lojas>): Promise<LojaComCoordenadas> => {
  try {
    const loja = await prisma.lojas.update({
      where: { id_loja },
      data: {
        ...data,
        localizacao: data.localizacao ? Buffer.from(data.localizacao) : null,
      },
    });

    const latitude = loja.localizacao ? loja.localizacao.readDoubleLE(0) : null;
    const longitude = loja.localizacao ? loja.localizacao.readDoubleLE(8) : null;

    return {
      ...loja,
      id_loja: String(loja.id_loja),
      latitude,
      longitude,
      data_criacao: loja.data_criacao ? new Date(loja.data_criacao).toISOString() : null,
      localizacao: loja.localizacao
    };
  } catch (error) {
    throw new Error(`Erro ao atualizar loja: ${error.message}`);
  }
};

// Função para deletar uma loja
export const deleteLoja = async (id_loja: string): Promise<void> => {
  try {
    const lojaExistente = await prisma.lojas.findUnique({
      where: { id_loja }
    });

    if (!lojaExistente) {
      throw new Error("Loja não encontrada");
    }

    await prisma.lojas.delete({
      where: { id_loja }
    });
  } catch (error) {
    throw new Error(`Erro ao deletar loja: ${error.message}`);
  }
};
