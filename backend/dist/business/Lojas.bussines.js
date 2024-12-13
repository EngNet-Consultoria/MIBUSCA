"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.obterLojaPorId = exports.obterLojas = exports.atualizarLoja = exports.criarLoja = void 0;
const client_1 = require("@prisma/client");
const mibusca_schema_1 = require("../schemas/mibusca.schema");
const prisma = new client_1.PrismaClient();
// Função para criar loja
const criarLoja = (data) => __awaiter(void 0, void 0, void 0, function* () {
    // Validação dos dados usando Zod
    const validData = mibusca_schema_1.LojasSchema.parse(data);
    // Lógica para criar loja no banco de dados
    const loja = yield prisma.lojas.create({
        data: {
            nome: validData.nome,
            status: validData.status,
            horario_operacao: validData.horario_operacao || null, // Permite null se não for fornecido
            data_criacao: validData.data_criacao || new Date(), // Define a data atual como fallback
            localizacao: validData.localizacao ? Buffer.from(validData.localizacao, 'base64') : null, // Converte Base64 para Buffer
        },
    });
    return loja;
});
exports.criarLoja = criarLoja;
// Função para atualizar loja
const atualizarLoja = (id_loja, data) => __awaiter(void 0, void 0, void 0, function* () {
    const validData = mibusca_schema_1.LojasSchema.parse(data);
    const updatedLoja = yield prisma.lojas.update({
        where: { id_loja },
        data: {
            nome: validData.nome,
            status: validData.status,
            horario_operacao: validData.horario_operacao || null,
            localizacao: validData.localizacao ? Buffer.from(validData.localizacao, 'base64') : null,
        },
    });
    return updatedLoja;
});
exports.atualizarLoja = atualizarLoja;
// Função para obter todas as lojas
const obterLojas = () => __awaiter(void 0, void 0, void 0, function* () {
    const lojas = yield prisma.lojas.findMany();
    return lojas;
});
exports.obterLojas = obterLojas;
// Função para obter uma loja por ID
const obterLojaPorId = (id_loja) => __awaiter(void 0, void 0, void 0, function* () {
    const loja = yield prisma.lojas.findUnique({
        where: { id_loja },
    });
    if (!loja) {
        throw new Error('Loja não encontrada');
    }
    return loja;
});
exports.obterLojaPorId = obterLojaPorId;
