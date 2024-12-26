import { Router } from "express";
import { createLoja, updateLoja, getLojas, getLojaById, deleteLoja } from "../business/Lojas.bussines";
import { LojasSchema } from "../schemas/mibusca.schema";

const router = Router();

// Rota para obter todas as lojas
router.get("/", async (req, res) => {
  try {
    const lojas = await getLojas();
    res.status(200).json(lojas);
  } catch (error) {
    console.error("Erro ao obter lojas:", error);
    res.status(500).json({ error: "Erro interno ao buscar lojas" });
  }
});

// Rota para obter uma loja pelo ID
router.get("/:id_loja", async (req, res) => {
  const { id_loja } = req.params;
  try {
    const loja = await getLojaById(id_loja);
    if (loja) {
      res.status(200).json(loja);
    } else {
      res.status(404).json({ error: "Loja não encontrada" });
    }
  } catch (error) {
    console.error(`Erro ao buscar loja com ID ${id_loja}:`, error);
    res.status(500).json({ error: "Erro interno ao buscar loja" });
  }
});

// Rota para criar uma nova loja
router.post("/", async (req, res) => {
  try {
    const data = LojasSchema.parse(req.body); // Validação de entrada com Zod
    const loja = await createLoja(data);
    res.status(201).json(loja);
  } catch (error) {
    console.error("Erro ao criar loja:", error);
    if (error.name === "ZodError") {
      res.status(400).json({ error: "Dados inválidos", details: error.errors });
    } else {
      res.status(500).json({ error: "Erro interno ao criar loja" });
    }
  }
});

// Rota para atualizar uma loja
router.put("/:id_loja", async (req, res) => {
  const { id_loja } = req.params;
  try {
    const data = LojasSchema.partial().parse(req.body); // Validação parcial com Zod
    const loja = await updateLoja(id_loja, data);
    if (loja) {
      res.status(200).json(loja);
    } else {
      res.status(404).json({ error: "Loja não encontrada para atualização" });
    }
  } catch (error) {
    console.error(`Erro ao atualizar loja com ID ${id_loja}:`, error);
    if (error.name === "ZodError") {
      res.status(400).json({ error: "Dados inválidos", details: error.errors });
    } else {
      res.status(500).json({ error: "Erro interno ao atualizar loja" });
    }
  }
});

// Rota para deletar uma loja
router.delete("/:id_loja", async (req, res) => {
  const { id_loja } = req.params;
  try {
    await deleteLoja(id_loja);
    res.status(204).send();
  } catch (error) {
    console.error(`Erro ao deletar loja com ID ${id_loja}:`, error);
    if (error.message.includes("não encontrada")) {
      res.status(404).json({ error: "Loja não encontrada para exclusão" });
    } else {
      res.status(500).json({ error: "Erro interno ao excluir loja" });
    }
  }
});

export default router;
