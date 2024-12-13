import { z } from "zod";

// Schema de Token Validation
export const TokenValidationSchema = z.object({
  id: z.number().int().positive(),
  client_id: z.string().max(255),
  client_secret: z.string().max(255),
  access_token: z.string(),
  token_expiration: z.string().transform((str) => new Date(str)), // Converte string para Date
  refresh_token: z.string(),
  user_code: z.string().nullable().optional(),
  authorization_code: z.string().nullable().optional(),
  auth_verification_code: z.string().nullable().optional(),
  verification_url: z.string().nullable().optional(),
  verification_url_full: z.string().nullable().optional(),
});

// Schema de Lojas
export const LojasSchema = z.object({
  id_loja: z.number().int().positive().optional(), // id_loja pode ser opcional em alguns casos (por exemplo, criação)
  nome: z.string().max(255),
  status: z.number().int().min(0).max(2), // 0: Aberta, 1: Fechada por erro, 2: Fora do horário
  horario_operacao: z.string().optional(),
  data_criacao: z.string().transform((str) => new Date(str)).optional(),
  localizacao: z.string().optional(),
});

// Schema de Vendas
export const VendasSchema = z.object({
  id_venda: z.number().int().positive(),
  id_loja: z.number().int().positive(),
  data_hora: z.string().transform((str) => new Date(str)), // Converte string para Date
  valor_total: z.number().positive(),
  ticket_medio: z.number().optional(), // Pode ser nulo ou omitido
  tipo_cliente: z.enum(["0", "1"]).transform(Number), // Converte string para número
  cancelada: z.boolean().optional().default(false),
  promocao_aplicada: z.boolean().optional().default(false),
  roi: z.number().optional(), // Pode ser nulo ou omitido
});

// Schema de Operacao
export const OperacaoSchema = z.object({
  id_operacao: z.number().int().positive(),
  id_loja: z.number().int().positive(),
  data_hora_inicio: z.string().transform((str) => new Date(str)),
  data_hora_fim: z.string().transform((str) => new Date(str)).optional(),
  tempo_total: z.number().optional(),
  cancelamentos: z.number().int().optional().default(0),
  erros_plataforma: z.number().int().optional(),
});

// Schema de Clientes
export const ClientesSchema = z.object({
  id_cliente: z.number().int().positive(),
  nome: z.string().max(255).optional(),
  id_loja: z.number().int().positive(),
  distancia_raio: z.number().positive(),
  tipo: z.enum(["Potencial", "Real"]),
  data_ultima_compra: z.string().transform((str) => new Date(str)).optional(),
});

// Types
export type TokenValidation = z.infer<typeof TokenValidationSchema>;
export type Lojas = z.infer<typeof LojasSchema>;
export type Vendas = z.infer<typeof VendasSchema>;
export type Operacao = z.infer<typeof OperacaoSchema>;
export type Clientes = z.infer<typeof ClientesSchema>;
