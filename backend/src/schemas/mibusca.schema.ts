import { z } from "zod";

// Schema de Token Validation
export const TokenValidationSchema = z.object({
  id: z.number().int().positive(),
  client_id: z.string().max(191),
  client_secret: z.string().max(191),
  access_token: z.string(), // Alterado para z.string() sem limite, como no banco de dados
  token_expiration: z.date(),
});

// Schema de Lojas
export const LojasSchema = z.object({
  id_loja: z.string().max(191), // ID como string com limite definido
  nome: z.string().max(191),
  status: z.number().int().min(0), // Valor inteiro para status
  horario_operacao: z.date().nullable().optional(),
  data_criacao: z.date().optional(),
  localizacao: z.union([z.string(), z.null()]).optional(), // Representação de LONGBLOB como string ou null
});

// Schema de Vendas
export const VendasSchema = z.object({
  id_venda: z.string().max(191),
  id_cliente: z.string().max(191),
  id_loja: z.string().max(191),
  distancia_raio: z.number().positive().nullable().optional(), // Agora é opcional e pode ser null
  data_hora: z.date(),
  valor_total: z.number().positive(),
  ticket_medio: z.number().nullable().optional(),
  tipo_cliente: z.number().int().min(0).max(1), // Mantendo como número inteiro para 0 ou 1
  cancelada: z.boolean().optional().default(false),
  promocao_aplicada: z.boolean().optional().default(false),
  promocao: z.string().nullable().optional(), 
  cancelamentos: z.number().int().optional().default(0), 
  erros_plataforma: z.number().int().optional().default(0), 
});

// Types
export type TokenValidation = z.infer<typeof TokenValidationSchema>;
export type Lojas = z.infer<typeof LojasSchema>;
export type Vendas = z.infer<typeof VendasSchema>;
