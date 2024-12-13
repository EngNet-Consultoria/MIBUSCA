"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientesSchema = exports.OperacaoSchema = exports.VendasSchema = exports.LojasSchema = exports.TokenValidationSchema = void 0;
const zod_1 = require("zod");
// Schema de Token Validation
exports.TokenValidationSchema = zod_1.z.object({
    id: zod_1.z.number().int().positive(),
    client_id: zod_1.z.string().max(255),
    client_secret: zod_1.z.string().max(255),
    access_token: zod_1.z.string(),
    token_expiration: zod_1.z.string().transform((str) => new Date(str)), // Converte string para Date
    refresh_token: zod_1.z.string(),
    user_code: zod_1.z.string().optional(),
    authorization_code: zod_1.z.string().optional(),
    auth_verification_code: zod_1.z.string().optional(),
    verification_url: zod_1.z.string().optional(),
    verification_url_full: zod_1.z.string().optional(),
});
// Schema de Lojas (corrigido)
exports.LojasSchema = zod_1.z.object({
    id_loja: zod_1.z.number().int().positive().optional(), // id_loja pode ser opcional em alguns casos (por exemplo, criação)
    nome: zod_1.z.string().max(255),
    status: zod_1.z.number().int().min(0).max(2), // 0: Aberta, 1: Fechada por erro, 2: Fora do horário
    horario_operacao: zod_1.z.string().optional(), // Para DATA, armazene como string
    data_criacao: zod_1.z.string().transform((str) => new Date(str)).optional(),
    localizacao: zod_1.z.string().optional() // Aqui assumimos que é uma string base64
});
// Schema de Vendas
exports.VendasSchema = zod_1.z.object({
    id_venda: zod_1.z.number().int().positive(),
    id_loja: zod_1.z.number().int().positive(),
    data_hora: zod_1.z.string().transform((str) => new Date(str)), // Converte TIMESTAMP para string
    valor_total: zod_1.z.number().positive(),
    ticket_medio: zod_1.z.number().optional(),
    tipo_cliente: zod_1.z.enum(['Novo', 'Recorrente']),
    cancelada: zod_1.z.boolean().optional().default(false),
    promocao_aplicada: zod_1.z.boolean().optional().default(false),
    roi: zod_1.z.number().optional()
});
// Schema de Operacao
exports.OperacaoSchema = zod_1.z.object({
    id_operacao: zod_1.z.number().int().positive(),
    id_loja: zod_1.z.number().int().positive(),
    data_hora_inicio: zod_1.z.string().transform((str) => new Date(str)), // Converte TIMESTAMP para string
    data_hora_fim: zod_1.z.string().transform((str) => new Date(str)).optional(), // Converte TIMESTAMP para string
    tempo_total: zod_1.z.number().optional(), // TIMESTAMPDIFF será calculado na aplicação
    cancelamentos: zod_1.z.number().int().optional().default(0),
    erros_plataforma: zod_1.z.number().int().optional()
});
// Schema de Clientes
exports.ClientesSchema = zod_1.z.object({
    id_cliente: zod_1.z.number().int().positive(),
    nome: zod_1.z.string().max(255).optional(), // pseudônimo
    id_loja: zod_1.z.number().int().positive(),
    distancia_raio: zod_1.z.number().positive(),
    tipo: zod_1.z.enum(['Potencial', 'Real']),
    data_ultima_compra: zod_1.z.string().transform((str) => new Date(str)).optional(), // Converte DATE para string
});
