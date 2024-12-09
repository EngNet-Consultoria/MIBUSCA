import { Router } from "express";
import {
  listMetricas,
  getMetricasById,
  createMetricas,
  updateMetricas,
  deleteMetricas
} from "../business/metricas.business";
import createHttpError from "http-errors";

const router = Router();

// List all metrics
router.get("/", async (req, res) => {
  try {
    const metricas = await listMetricas();
    return res.status(200).json(metricas);
  } catch (error) {
    return res.status(500).json({ message: "Erro ao listar métricas" });
  }
});

// Get a single metric by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const metricas = await getMetricasById(id);
    if (metricas) {
      return res.status(200).json(metricas);
    } else {
      return res.status(404).json({ message: "Métrica não encontrada" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Erro ao buscar métrica" });
  }
});

// Create a new metric
router.post("/", async (req, res) => {
  try {
    const newMetricas = req.body;
    const createdMetricas = await createMetricas(newMetricas);
    return res.status(201).json(createdMetricas);
  } catch (error) {
    return res.status(500).json({ message: "Erro ao criar métrica" });
  }
});

// Update an existing metric by ID
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    const updatedMetricas = await updateMetricas(id, updatedData);
    if (updatedMetricas) {
      return res.status(200).json(updatedMetricas);
    } else {
      return res.status(404).json({ message: "Métrica não encontrada" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Erro ao atualizar métrica" });
  }
});


// Delete a metric by ID
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await deleteMetricas(id);
    if (deleted) {
      return res.status(204).send(); // No content
    } else {
      return res.status(404).json({ message: "Métrica não encontrada" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Erro ao deletar métrica" });
  }
});

export default router;
