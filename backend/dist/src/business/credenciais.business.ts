import { PrismaClient } from '@prisma/client';
import { TokenValidationSchema, TokenValidation } from '../schemas/mibusca.schema';

const prisma = new PrismaClient();

// Função auxiliar para transformar campos opcionais de undefined para null
function transformOptionalFields<T extends Record<string, any>>(data: T): T {
  return Object.fromEntries(
    Object.entries(data).map(([key, value]) => [
      key,
      value === undefined ? null : value,
    ])
  ) as T;
}

// Função para listar todas as credenciais
export const getCredenciais = async (): Promise<TokenValidation[]> => {
  return await prisma.tokenValidation.findMany();
};

// Função para obter uma credencial pelo ID
export const getCredencialById = async (id: number): Promise<TokenValidation> => {
  const credencial = await prisma.tokenValidation.findUnique({
    where: { id },
  });
  if (!credencial) {
    throw new Error('Credencial não encontrada');
  }
  return credencial;
};

// Função para criar uma nova credencial
export const createCredencial = async (data: TokenValidation) => {
  // Valida e transforma os dados
  const validData = transformOptionalFields(TokenValidationSchema.parse(data));

  return await prisma.tokenValidation.create({
    data: validData,
  });
};

// Função para atualizar uma credencial pelo ID
export const updateCredencial = async (id: number, data: Partial<TokenValidation>) => {
  // Valida e transforma os dados
  const validData = transformOptionalFields(TokenValidationSchema.parse(data));

  return await prisma.tokenValidation.update({
    where: { id },
    data: validData,
  });
};

// Função para deletar uma credencial pelo ID
export const deleteCredencial = async (id: number): Promise<void> => {
  await prisma.tokenValidation.delete({
    where: { id },
  });
};
