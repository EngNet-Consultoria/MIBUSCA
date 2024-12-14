import express from "express";
import dotenv from "dotenv-safe";
import helmet from "helmet";
import cors from "cors";
import "express-async-errors";

import { prisma } from "./prisma";

import { handleZodError } from "./middlewares/handleZodError.middleware";
import { handlePrismaError } from "./middlewares/handlePrismaError.middleware";
import { handleCommonError } from "./middlewares/handleCommonError.middleware";

import lojas from "./routes/Lojas.routes";
import credenciais from "./routes/credenciais.routes";
import vendas from "./routes/Vendas.routes";
import clientes from "./routes/Clientes.routes"
import operacao from "./routes/operacao.routes"

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());

// Incluindo as rotas
app.use("/lojas", lojas);
app.use("/credenciais", credenciais);
app.use("/vendas", vendas);
app.use("/clientes",clientes); 
app.use("/operacao", operacao)

app.use(handleZodError);
app.use(handlePrismaError);
app.use(handleCommonError);

const PORT = process.env.PORT ?? 8080;

app.listen(PORT, async () => {
  await prisma.$connect();
  console.log(`Servidor rodando: http://localhost:${PORT}`);
});
