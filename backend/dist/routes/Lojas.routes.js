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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Lojas_bussines_1 = require("../business/Lojas.bussines"); // Corrigir o caminho se necessário
const router = express_1.default.Router();
// Rota para criar loja
router.post('/lojas', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const loja = yield (0, Lojas_bussines_1.criarLoja)(req.body); // Passando o corpo da requisição para a função criarLoja
        res.status(201).json(loja);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}));
// Rota para atualizar uma loja
router.put('/lojas/:id_loja', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const loja = yield (0, Lojas_bussines_1.atualizarLoja)(Number(req.params.id_loja), req.body); // Passando o ID da loja e o corpo da requisição
        res.status(200).json(loja);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}));
// Rota para listar todas as lojas
router.get('/lojas', (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const lojas = yield (0, Lojas_bussines_1.obterLojas)();
        res.status(200).json(lojas);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}));
// Rota para obter uma loja específica
router.get('/lojas/:id_loja', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const loja = yield (0, Lojas_bussines_1.obterLojaPorId)(Number(req.params.id_loja));
        res.status(200).json(loja);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}));
exports.default = router;
