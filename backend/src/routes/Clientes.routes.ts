// clientesRoutes.ts
import { Router } from "express";
import {
  getAllClientes,
  getClienteById,
  createCliente,
  updateCliente,
  deleteCliente,
} from "../business/Clientes.bussines";

const router = Router();

// Rota para listar todos os clientes
router.get("/", async (_req, res, next) => {
  try {
    const clientes = await getAllClientes();
    res.status(200).json(clientes);
  } catch (err) {
    next(err);
  }
});

// Rota para obter um cliente específico
router.get("/:id_cliente", async (req, res, next) => {
  try {
    const { id_cliente } = req.params;
    const cliente = await getClienteById(Number(id_cliente));
    if (!cliente) {
      res.status(404).json({ error: "Cliente não encontrado" });
      return;
    }
    res.status(200).json(cliente);
  } catch (err) {
    next(err);
  }
});

// Rota para criar um novo cliente
router.post("/", async (req, res, next) => {
  try {
    const data = req.body;
    const newCliente = await createCliente(data);
    res.status(201).json(newCliente);
  } catch (err) {
    next(err);
  }
});

// Rota para atualizar um cliente
router.put("/:id_cliente", async (req, res, next) => {
  try {
    const { id_cliente } = req.params;
    const data = req.body;
    const updatedCliente = await updateCliente(Number(id_cliente), data);
    if (!updatedCliente) {
      res.status(404).json({ error: "Cliente não encontrado" });
      return;
    }
    res.status(200).json(updatedCliente);
  } catch (err) {
    next(err);
  }
});

// Rota para deletar um cliente
router.delete("/:id_cliente", async (req, res, next) => {
  try {
    const { id_cliente } = req.params;
    const deleted = await deleteCliente(Number(id_cliente));
    if (!deleted) {
      res.status(404).json({ error: "Cliente não encontrado" });
      return;
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

export default router;
