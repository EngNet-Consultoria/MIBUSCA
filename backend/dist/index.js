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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_safe_1 = __importDefault(require("dotenv-safe"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
require("express-async-errors");
const prisma_1 = require("./prisma");
const handleZodError_middleware_1 = require("./middlewares/handleZodError.middleware");
const handlePrismaError_middleware_1 = require("./middlewares/handlePrismaError.middleware");
const handleCommonError_middleware_1 = require("./middlewares/handleCommonError.middleware");
const Lojas_routes_1 = __importDefault(require("./routes/Lojas.routes"));
dotenv_safe_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)());
// Include your routes here
app.use("/lojas", Lojas_routes_1.default);
app.use(handleZodError_middleware_1.handleZodError);
app.use(handlePrismaError_middleware_1.handlePrismaError);
app.use(handleCommonError_middleware_1.handleCommonError);
const PORT = (_a = process.env.PORT) !== null && _a !== void 0 ? _a : 8080;
app.listen(PORT, () => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.prisma.$connect();
    console.log(`Servidor rodando: http://localhost:${PORT}`);
}));
