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
});

export default router;
