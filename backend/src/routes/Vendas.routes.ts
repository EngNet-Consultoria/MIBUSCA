<<<<<<< HEAD
import { Router } from "express";
import { getAllVendas, getVendaById, createVenda, updateVenda, deleteVenda } from "../business/Vendas.business";

const router = Router();

router.get("/", async (req, res, next) => {
    try {
        const vendas = await getAllVendas();
        res.json(vendas);
    } catch (err) {
        next(err);
    }
});

router.get("/:id", async (req, res, next) => {
    try {
        const { id } = req.params;
        const venda = await getVendaById(Number(id));
        if (!venda) {
            res.status(404).send({ error: "Venda não encontrada" });
            return;
        }
        res.json(venda);
    } catch (err) {
        next(err);
    }
});

router.post("/", async (req, res, next) => {
    try {
        const data = req.body;
        const newVenda = await createVenda(data);
        res.status(201).json(newVenda);
    } catch (err) {
        next(err);
    }
});

router.put("/:id", async (req, res, next) => {
    try {
        const { id } = req.params;
        const data = req.body;
        const updatedVenda = await updateVenda(Number(id), data);
        res.json(updatedVenda);
    } catch (err) {
        next(err);
    }
});

router.delete("/:id", async (req, res, next) => {
    try {
        const { id } = req.params;
        await deleteVenda(Number(id));
        res.status(204).send();
    } catch (err) {
        next(err);
    }
=======
import express, { Request, Response } from 'express';
import { criarVenda, atualizarVenda, obterVendas, obterVendaPorId } from '../business/Vendas.business'; // Corrigir o caminho se necessário

const router = express.Router();

// Rota para criar venda
router.post('/vendas', async (req: Request, res: Response) => {
  try {
    const venda = await criarVenda(req.body); // Passando o corpo da requisição para a função criarVenda
    res.status(201).json(venda);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Rota para atualizar uma venda
router.put('/vendas/:id_venda', async (req: Request, res: Response) => {
  try {
    const venda = await atualizarVenda(Number(req.params.id_venda), req.body); // Passando o ID da venda e o corpo da requisição
    res.status(200).json(venda);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Rota para listar todas as vendas
router.get('/vendas', async (_req: Request, res: Response) => {
  try {
    const vendas = await obterVendas();
    res.status(200).json(vendas);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Rota para obter uma venda específica
router.get('/vendas/:id_venda', async (req: Request, res: Response) => {
  try {
    const venda = await obterVendaPorId(Number(req.params.id_venda));
    res.status(200).json(venda);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
>>>>>>> main
});

export default router;
