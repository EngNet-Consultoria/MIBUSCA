import express, { Request, Response } from 'express';
import { criarLoja, atualizarLoja, obterLojas, obterLojaPorId } from '../business/Lojas.bussines'; // Corrigir o caminho se necessário

const router = express.Router();

// Rota para criar loja
router.post('/lojas', async (req: Request, res: Response) => {
  try {
    const loja = await criarLoja(req.body); // Passando o corpo da requisição para a função criarLoja
    res.status(201).json(loja);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Rota para atualizar uma loja
router.put('/lojas/:id_loja', async (req: Request, res: Response) => {
  try {
    const loja = await atualizarLoja(Number(req.params.id_loja), req.body); // Passando o ID da loja e o corpo da requisição
    res.status(200).json(loja);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Rota para listar todas as lojas
router.get('/lojas', async (_req: Request, res: Response) => {
  try {
    const lojas = await obterLojas();
    res.status(200).json(lojas);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Rota para obter uma loja específica
router.get('/lojas/:id_loja', async (req: Request, res: Response) => {
  try {
    const loja = await obterLojaPorId(Number(req.params.id_loja));
    res.status(200).json(loja);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
