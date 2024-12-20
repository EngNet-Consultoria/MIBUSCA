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
import clientes from "./routes/Clientes.routes";
import operacao from "./routes/operacao.routes";

import swaggerUi from "swagger-ui-express";

dotenv.config();

const app = express();

// Middleware para leitura de JSON e segurança
app.use(express.json());
app.use(cors());
app.use(helmet());

// Definição da documentação Swagger diretamente no código
const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "API Documentation",
    version: "1.0.0",
    description: "Documentação da API para o projeto.",
  },
  servers: [
    {
      url: "http://localhost:8080",
      description: "Servidor local",
    },
  ],
  paths: {
    "/lojas": {
      get: {
        summary: "Lista todas as lojas",
        tags: ["Lojas"],
        responses: {
          200: {
            description: "Lista de lojas retornada com sucesso",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      id: { type: "integer" },
                      nome: { type: "string" },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/credenciais": {
      post: {
        summary: "Adiciona novas credenciais",
        tags: ["Credenciais"],
        requestBody: {
          description: "Dados das credenciais",
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  username: { type: "string" },
                  password: { type: "string" },
                },
                required: ["username", "password"],
              },
            },
          },
        },
        responses: {
          201: { description: "Credenciais criadas com sucesso" },
        },
      },
    },
    // Outras rotas podem ser adicionadas aqui
  },
};

// Configuração do Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Incluindo as rotas
app.use("/lojas", lojas);
app.use("/credenciais", credenciais);


// Middleware de tratamento de erros
app.use(handleZodError);
app.use(handlePrismaError);
app.use(handleCommonError);

// Configuração da porta
const PORT = process.env.PORT ?? 8080;

// Inicialização do servidor
app.listen(PORT, async () => {
  try {
    await prisma.$connect();
    console.log(`Servidor rodando em: http://localhost:${PORT}`);
    console.log(`Documentação disponível em: http://localhost:${PORT}/api-docs`);
  } catch (error) {
    console.error("Erro ao conectar ao banco de dados:", error);
    process.exit(1); // Finaliza o processo em caso de erro
  }
});
