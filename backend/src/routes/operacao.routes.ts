import { Router } from "express";
import {
  getAllOperacoes,
  getOperacaoById,
  createOperacao,
  updateOperacao,
  deleteOperacao,
} from "../business/operacao.bussines";

const router = Router();

// Rota para listar todas as operações
router.get("/", async (_req, res, next) => {
  try {
    const operacoes = await getAllOperacoes();
    res.status(200).json(operacoes);
  } catch (err) {
    next(err);
  }
});

// Rota para obter uma operação específica
router.get("/:id_operacao", async (req, res, next) => {
  try {
    const { id_operacao } = req.params;
    const operacao = await getOperacaoById(Number(id_operacao));
    if (!operacao) {
      res.status(404).json({ error: "Operação não encontrada" });
      return;
    }
    res.status(200).json(operacao);
  } catch (err) {
    next(err);
  }
});

// Rota para criar uma nova operação
router.post("/", async (req, res, next) => {
  try {
    const data = req.body;
    const newOperacao = await createOperacao(data);
    res.status(201).json(newOperacao);
  } catch (err) {
    next(err);
  }
});

// Rota para atualizar uma operação existente
router.put("/:id_operacao", async (req, res, next) => {
  try {
    const { id_operacao } = req.params;
    const data = req.body;
    const updatedOperacao = await updateOperacao(Number(id_operacao), data);
    if (!updatedOperacao) {
      res.status(404).json({ error: "Operação não encontrada" });
      return;
    }
    res.status(200).json(updatedOperacao);
  } catch (err) {
    next(err);
  }
});

// Rota para deletar uma operação
router.delete("/:id_operacao", async (req, res, next) => {
  try {
    const { id_operacao } = req.params;
    const deleted = await deleteOperacao(Number(id_operacao));
    if (!deleted) {
      res.status(404).json({ error: "Operação não encontrada" });
      return;
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

export default router;
