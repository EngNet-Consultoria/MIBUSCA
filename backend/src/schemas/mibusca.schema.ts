import { z } from "zod";

// Schema de Token Validation
export const TokenValidationSchema = z.object({
  id: z.number().int().positive(),
  client_id: z.string().max(255),
  client_secret: z.string().max(255),
  access_token: z.string(),
  token_expiration: z.string().transform((str) => new Date(str)), // Converte string para Date
  refresh_token: z.string(),
<<<<<<< HEAD
  user_code: z.string().nullable().optional(),
  authorization_code: z.string().nullable().optional(),
  auth_verification_code: z.string().nullable().optional(),
  verification_url: z.string().nullable().optional(),
  verification_url_full: z.string().nullable().optional(),
});


// Schema de Lojas
=======
  user_code: z.string().optional(),
  authorization_code: z.string().optional(),
  auth_verification_code: z.string().optional(),
  verification_url: z.string().optional(),
  verification_url_full: z.string().optional(),
});


// Schema de Lojas (corrigido)
>>>>>>> main
export const LojasSchema = z.object({
  id_loja: z.number().int().positive().optional(), // id_loja pode ser opcional em alguns casos (por exemplo, criação)
  nome: z.string().max(255),
  status: z.number().int().min(0).max(2), // 0: Aberta, 1: Fechada por erro, 2: Fora do horário
<<<<<<< HEAD
  horario_operacao: z.string().optional(),
  data_criacao: z.string().transform((str) => new Date(str)).optional(),
  localizacao: z.string().optional()
});

// Schema de Vendas
export const VendasSchema = z.object({
  id_loja: z.number().positive(),
  data_hora: z.string().transform((str) => new Date(str)), // Converte string para Date
  valor_total: z.number().positive(),
  ticket_medio: z.number().optional(), // Pode ser nulo ou omitido
  tipo_cliente: z.enum(["0", "1"]).transform(Number), // Converte string para número
  cancelada: z.boolean().optional().default(false),
  promocao_aplicada: z.boolean().optional().default(false),
  roi: z.number().optional(), // Pode ser nulo ou omitido
=======
  horario_operacao: z.string().optional(), // Para DATA, armazene como string
  data_criacao: z.string().transform((str) => new Date(str)).optional(),
  localizacao: z.string().optional() // Aqui assumimos que é uma string base64
});


// Schema de Vendas
export const VendasSchema = z.object({
  id_venda: z.number().int().positive(),
  id_loja: z.number().int().positive(),
  data_hora: z.string().transform((str) => new Date(str)), // Converte TIMESTAMP para string
  valor_total: z.number().positive(),
  ticket_medio: z.number().optional(),
  tipo_cliente: z.number().int().min(0).max(1), // 0 = novo, 1 = recorrente 
  cancelada: z.boolean().optional().default(false),
  promocao_aplicada: z.boolean().optional().default(false),
  roi: z.number().optional()
>>>>>>> main
});

// Schema de Operacao
export const OperacaoSchema = z.object({
  id_operacao: z.number().int().positive(),
  id_loja: z.number().int().positive(),
<<<<<<< HEAD
  data_hora_inicio: z.string().transform((str) => new Date(str)),
  data_hora_fim: z.string().transform((str) => new Date(str)).optional(),
  tempo_total: z.number().optional(),
=======
  data_hora_inicio: z.string().transform((str) => new Date(str)), // Converte TIMESTAMP para string
  data_hora_fim: z.string().transform((str) => new Date(str)).optional(), // Converte TIMESTAMP para string
  tempo_total: z.number().optional(), // TIMESTAMPDIFF será calculado na aplicação
>>>>>>> main
  cancelamentos: z.number().int().optional().default(0),
  erros_plataforma: z.number().int().optional()
});

// Schema de Clientes
export const ClientesSchema = z.object({
  id_cliente: z.number().int().positive(),
<<<<<<< HEAD
  nome: z.string().max(255).optional(),
  id_loja: z.number().int().positive(),
  distancia_raio: z.number().positive(),
  tipo: z.enum(['Potencial', 'Real']),
  data_ultima_compra: z.string().transform((str) => new Date(str)).optional(),
=======
  nome: z.string().max(255).optional(), // pseudônimo
  id_loja: z.number().int().positive(),
  distancia_raio: z.number().positive(),
  tipo: z.enum(['Potencial', 'Real']),
  data_ultima_compra: z.string().transform((str) => new Date(str)).optional(), // Converte DATE para string
>>>>>>> main
});

// Types
export type TokenValidation = z.infer<typeof TokenValidationSchema>;
export type Lojas = z.infer<typeof LojasSchema>;
export type Vendas = z.infer<typeof VendasSchema>;
export type Operacao = z.infer<typeof OperacaoSchema>;
export type Clientes = z.infer<typeof ClientesSchema>;
