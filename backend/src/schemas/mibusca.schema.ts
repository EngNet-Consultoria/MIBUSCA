import { z } from "zod";

// Schema de Token Validation
export const TokenValidationSchema = z.object({
  id: z.number().int().positive(),
  client_id: z.string().max(191),
  client_secret: z.string().max(191),
  access_token: z.string(),
  token_expiration: z.date(),
});

// Schema de Lojas
export const LojasSchema = z.object({
  id_loja: z.string().max(191),
  nome: z.string().max(191),
  status: z.number().int().min(0),
  horario_operacao: z.date().nullable().optional(),
  data_criacao: z.date().optional(),
  localizacao: z.union([z.string(), z.null()]).optional(),
});

// Schema de Vendas
export const VendasSchema = z.object({
  id_venda: z.string().max(191),
  id_cliente: z.string().max(191),
  id_loja: z.string().max(191),
  distancia_raio: z.number().positive(),
  data_hora: z.date(),
  valor_total: z.number().positive(),
  ticket_medio: z.number().nullable().optional(),
  tipo_cliente: z.number().int().min(0).max(1),
  cancelada: z.boolean().optional().default(false),
  promocao_aplicada: z.boolean().optional().default(false),
  cancelamentos: z.number().int().optional().default(0),
  erros_plataforma: z.number().int().optional().default(0),
});

// Schema de Operações
export const OperacaoSchema = z.object({
  id_operacao: z.string().max(191),
  id_loja: z.string().max(191),
  data_hora_inicio: z.date(),
  data_hora_fim: z.date().nullable().optional(),
  cancelamentos: z.number().int().optional().default(0),
  erros_plataforma: z.number().int().optional().default(0),
});

// Schema de Clientes (atualizado)
export const ClientesSchema = z.object({
  id_cliente: z.string().max(191), 
  nome: z.string().max(191), 
  email: z.string().email().max(191), 
  telefone: z.string().max(20).nullable().optional(), 
  status: z.boolean().default(true), 
  data_cadastro: z.date().optional(), 

  id_loja: z.string().max(191), 
  distancia_raio: z.number().positive(), 
  tipo: z.number().int().min(0).max(2), 
  data_ultima_compra: z.date().nullable().optional(), 
});

// Types
export type TokenValidation = z.infer<typeof TokenValidationSchema>;
export type Lojas = z.infer<typeof LojasSchema>;
export type Vendas = z.infer<typeof VendasSchema>;
export type Clientes = z.infer<typeof ClientesSchema>;
export type Operacao = z.infer<typeof OperacaoSchema>;
