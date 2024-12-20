import { z } from "zod";

// Schema de Token Validation
export const TokenValidationSchema = z.object({
  id: z.number().int().positive(),
  client_id: z.string().max(255),
  client_secret: z.string().max(255),
  access_token: z.string(),
  token_expiration: z.date(),
  refresh_token: z.string(),
  user_code: z.string().nullable().optional(),
  authorization_code: z.string().nullable().optional(),
  auth_verification_code: z.string().nullable().optional(),
  verification_url: z.string().nullable().optional(),
  verification_url_full: z.string().nullable().optional(),
});

// Schema de Lojas
export const LojasSchema = z.object({
  id_loja: z.string().length(36), // Alterado para string com tamanho 36 (UUID)
  nome: z.string().max(255),
  status: z.number().int().min(0).max(2),
  horario_operacao: z.string().optional(),
  data_criacao: z.date().optional(),
  localizacao: z.string().optional(), // Para ponto, pode ser uma string representando coordenadas
});

// Schema de Vendas
export const VendasSchema = z.object({
  id_venda: z.string().length(36),
  id_loja: z.string().length(36),
  data_hora: z.date(),
  valor_total: z.number().positive(),
  ticket_medio: z.number().optional(),
  tipo_cliente: z.enum(["0", "1"]).transform(Number),
  cancelada: z.boolean().optional().default(false),
  promocao_aplicada: z.boolean().optional().default(false),
  roi: z.number().optional(),
});

// Schema de Operacao
export const OperacaoSchema = z.object({
  id_operacao: z.string().length(36),
  id_loja: z.string().length(36),
  data_hora_inicio: z.date(),
  data_hora_fim: z.date().optional(),
  tempo_total: z.number().optional(),
  cancelamentos: z.number().int().optional().default(0),
  erros_plataforma: z.number().int(),
});

// Schema de Clientes
export const ClientesSchema = z.object({
  id_cliente: z.string().length(36),
  nome: z.string().max(255).optional(),
  id_loja: z.string().length(36),
  distancia_raio: z.number().positive(),
  tipo: z.enum(["0", "1"]).transform(Number),
  data_ultima_compra: z.date().optional(),
});

// Types
export type TokenValidation = z.infer<typeof TokenValidationSchema>;
export type Lojas = z.infer<typeof LojasSchema>;
export type Vendas = z.infer<typeof VendasSchema>;
export type Operacao = z.infer<typeof OperacaoSchema>;
export type Clientes = z.infer<typeof ClientesSchema>;
