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
});

export default router;
