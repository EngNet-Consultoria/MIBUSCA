import { Router } from "express";
import { createLoja, updateLoja, getLojas, getLojaById, deleteLoja } from "../business/Lojas.bussines";
import { LojasSchema } from "../schemas/mibusca.schema"; // Validação com Zod ou qualquer outro schema

const router = Router();

// Rota para obter todas as lojas
router.get("/", async (req, res) => {
  try {
    const lojas = await getLojas();
    res.status(200).json(lojas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rota para obter uma loja pelo ID
router.get("/:id_loja", async (req, res) => {
  const { id_loja } = req.params;
  try {
    const loja = await getLojaById(id_loja);
    res.status(200).json(loja);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// Rota para criar uma nova loja
router.post("/", async (req, res) => {
  try {
    const data = LojasSchema.parse(req.body); // Validação com Zod ou qualquer outra biblioteca de validação
    const loja = await createLoja(data);
    res.status(201).json(loja);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Rota para atualizar uma loja
router.put("/:id_loja", async (req, res) => {
  const { id_loja } = req.params;
  try {
    const data = LojasSchema.partial().parse(req.body); // Validação com Zod ou qualquer outra biblioteca de validação
    const loja = await updateLoja(id_loja, data);
    res.status(200).json(loja);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Rota para deletar uma loja
router.delete("/:id_loja", async (req, res) => {
  const { id_loja } = req.params;
  try {
    await deleteLoja(id_loja);
    res.status(204).send(); 
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
