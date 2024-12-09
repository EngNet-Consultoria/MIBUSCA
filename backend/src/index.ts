import express from "express";
import dotenv from "dotenv-safe";
import helmet from "helmet";
import cors from "cors";
import "express-async-errors";

import { prisma } from "./prisma";

import { handleZodError } from "./middlewares/handleZodError.middleware";
import { handlePrismaError } from "./middlewares/handlePrismaError.middleware";
import { handleCommonError } from "./middlewares/handleCommonError.middleware";

import metricas from "./routes/metricas.route";
import notas from "./routes/notas.route"

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());

// Include your routes here
app.use("/metricas", metricas);
app.use("/nota", notas);

app.use(handleZodError);
app.use(handlePrismaError);
app.use(handleCommonError);

const PORT = process.env.PORT ?? 8080;

app.listen(PORT, async () => {
  await prisma.$connect();
  console.log(`Servidor rodando: http://localhost:${PORT}`);
});
