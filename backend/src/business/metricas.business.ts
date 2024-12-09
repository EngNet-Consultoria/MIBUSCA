import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const listMetricas = async () => {
  return await prisma.metricas.findMany();
};

export const getMetricasById = async (id: string) => {
  return await prisma.metricas.findUnique({
    where: { id }
  });
};

export const createMetricas = async (data: {
  id: string;
  ticket_diaria: number;
  receita_com_taxas: number;
  taxas: number;
  taxa_de_limpeza: number;  
  taxa_enxoval: number; 
  taxa_parcelamento: number;  
  taxa_cafe: number;  
  comissao: number; 
  nota: number;
  data_dia: number;
  data_mes: number;
  nome_mes: string;
  data_ano: number;
  dia_chegada: string;
  dia_saida: string;
  numero_noites: number;
  DDD: string;
  hospedes: number;
  id_agente: string;
  nome_agente: string;
  canais: string;
  data_dia_criacao: number;
  data_mes_criacao: string;
  data_ano_criacao: number;
  siglas_condominios: string;
  estado: string;
  cidade: string;
  regiao: string;
  rua_numero: string;
  imovel: string;
}) => {
  return await prisma.metricas.create({
    data
  });
};

export const updateMetricas = async (id: string, data: {
  ticket_diaria?: number;
  receita_com_taxas?: number;
  taxas?: number;
  taxa_de_limpeza?: number;  
  taxa_enxoval?: number; 
  taxa_parcelamento?: number;  
  taxa_cafe?: number; 
  comissao?: number; 
  nota?: number;
  data_dia?: number;
  data_mes?: number;
  nome_mes?: string;
  data_ano?: number;
  dia_chegada?: string;
  dia_saida?: string;
  numero_noites?: number;
  DDD?: string;
  hospedes?: number;
  id_agente?: string;
  nome_agente?: string;
  canais?: string;
  data_dia_criacao?: number;
  data_mes_criacao?: string;
  data_ano_criacao?: number;
  siglas_condominios?: string;
  estado?: string;
  cidade?: string;
  regiao?: string;
  rua_numero?: string;
  imovel?: string;
}) => {
  return await prisma.metricas.update({
    where: { id },
    data
  });
};

export const deleteMetricas = async (id: string) => {
  try {
    await prisma.metricas.delete({
      where: { id }
    });
    return true;
  } catch (error) {
    return false; // Retorna false se a exclusão falhar (por exemplo, se o ID não existir)
  }
};
