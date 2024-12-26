import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { Lojas } from "../schemas/mibusca.schema";

const prisma = new PrismaClient();

// Schema para validar loja com coordenadas
const LojaComCoordenadasSchema = z.object({
  id_loja: z.string(),
  nome: z.string(),
  status: z.number().int(),
  data_criacao: z.date().nullable(),
  latitude: z.number().nullable(),
  longitude: z.number().nullable(),
  localizacao: z.instanceof(Buffer).nullable(),
});

type LojaComCoordenadas = z.infer<typeof LojaComCoordenadasSchema>;

// Função para obter todas as lojas
export const getLojas = async (): Promise<LojaComCoordenadas[]> => {
  try {
    const lojas = await prisma.$queryRaw<LojaComCoordenadas[]>`
      SELECT 
        id_loja, 
        nome, 
        status, 
        data_criacao, 
        ST_Y(localizacao) AS latitude, 
        ST_X(localizacao) AS longitude,
        localizacao
      FROM lojas;
    `;

    return lojas.map(loja => LojaComCoordenadasSchema.parse(loja));
  } catch (error) {
    throw new Error(`Erro ao obter lojas: ${error instanceof Error ? error.message : String(error)}`);
  }
};

// Função para obter uma loja pelo ID
export const getLojaById = async (id_loja: string): Promise<LojaComCoordenadas | null> => {
  try {
    const loja = await prisma.$queryRaw<LojaComCoordenadas[]>`
      SELECT 
        id_loja, 
        nome, 
        status, 
        data_criacao, 
        ST_Y(localizacao) AS latitude, 
        ST_X(localizacao) AS longitude,
        localizacao
      FROM lojas
      WHERE id_loja = ${id_loja};
    `;

    if (!loja.length) return null;
    return LojaComCoordenadasSchema.parse(loja[0]);
  } catch (error) {
    throw new Error(`Erro ao obter loja: ${error instanceof Error ? error.message : String(error)}`);
  }
};

// Função para criar uma nova loja
export const createLoja = async (data: Lojas): Promise<LojaComCoordenadas> => {
  try {
    const loja = await prisma.$queryRaw<LojaComCoordenadas[]>`
      INSERT INTO lojas (nome, status, data_criacao, localizacao)
      VALUES (
        ${data.nome}, 
        ${data.status}, 
        ${data.data_criacao}, -- 'data_criacao' aceita diretamente timestamps
        ${
          data.localizacao
            ? Buffer.from(data.localizacao)
            : null
        }
      )
      RETURNING id_loja, nome, status, data_criacao, ST_Y(localizacao) AS latitude, ST_X(localizacao) AS longitude, localizacao;
    `;

    if (!loja.length) {
      throw new Error("Erro ao criar loja: Nenhuma loja retornada.");
    }

    return LojaComCoordenadasSchema.parse(loja[0]);
  } catch (error) {
    throw new Error(`Erro ao criar loja: ${error instanceof Error ? error.message : String(error)}`);
  }
};

// Função para atualizar uma loja
export const updateLoja = async (id_loja: string, data: Partial<Lojas>): Promise<LojaComCoordenadas | null> => {
  try {
    const loja = await prisma.$queryRaw<LojaComCoordenadas[]>`
      UPDATE lojas
      SET 
        nome = ${data.nome || null}, 
        status = ${data.status || null}, 
        data_criacao = ${data.data_criacao || null}, -- Direto para timestamp
        localizacao = ${
          data.localizacao
            ? Buffer.from(data.localizacao)
            : null
        }
      WHERE id_loja = ${id_loja}
      RETURNING id_loja, nome, status, data_criacao, ST_Y(localizacao) AS latitude, ST_X(localizacao) AS longitude, localizacao;
    `;

    if (!loja.length) return null;
    return LojaComCoordenadasSchema.parse(loja[0]);
  } catch (error) {
    throw new Error(`Erro ao atualizar loja: ${error instanceof Error ? error.message : String(error)}`);
  }
};

// Função para deletar uma loja
export const deleteLoja = async (id_loja: string): Promise<void> => {
  try {
    const lojaExistente = await prisma.$queryRaw<LojaComCoordenadas[]>`
      SELECT id_loja FROM lojas WHERE id_loja = ${id_loja};
    `;

    if (!lojaExistente.length) {
      throw new Error("Loja não encontrada.");
    }

    await prisma.$queryRaw`
      DELETE FROM lojas WHERE id_loja = ${id_loja};
    `;
  } catch (error) {
    throw new Error(`Erro ao deletar loja: ${error instanceof Error ? error.message : String(error)}`);
  }
};
