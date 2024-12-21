import { Router } from "express";
import { getAllVendas, getVendaById, createVenda, updateVenda, deleteVenda } from "../business/Vendas.business"; 

const router = Router();

// Rota para listar todas as vendas
router.get("/", async (_req, res, next) => {
  try {
    const vendas = await getAllVendas();
    res.status(200).json(vendas);
  } catch (err) {
    next(err);
  }
});

// Rota para obter uma venda específica por ID
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const venda = await getVendaById(id);
    res.status(200).json(venda);
  } catch (err) {
    next(err);
  }
});

// Rota para criar uma nova venda
router.post("/", async (req, res, next) => {
  try {
    const data = req.body;
    const newVenda = await createVenda(data);
    res.status(201).json(newVenda);
  } catch (err) {
    next(err);
  }
});

// Rota para atualizar uma venda
router.put("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const updatedVenda = await updateVenda(id, data);
    res.status(200).json(updatedVenda);
  } catch (err) {
    next(err);
  }
});

// Rota para deletar uma venda
router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedVenda = await deleteVenda(id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

export default router;
