import express from 'express';
import {
    getCredenciais,
    getCredencialById,
    createCredencial,
    updateCredencial,
    deleteCredencial,
} from '../business/credenciais.business'; // tenho que ver se funciona em qualquer ambiente
//VERIFICAR A OBTENCAO DE CREDENCIAS DIRETO DO SITE COM O HTML
const router = express.Router();

// Listar todas as credenciais
router.get('/', async (req, res) => {
    try {
        const credenciais = await getCredenciais();
        res.status(200).json(credenciais);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Obter uma credencial por ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const credencial = await getCredencialById(Number(id));
        if (credencial) {
            res.status(200).json(credencial);
        } else {
            res.status(404).json({ message: 'Credencial não encontrada' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Criar uma nova credencial
router.post('/', async (req, res) => {
    try {
        const data = req.body;
        const novaCredencial = await createCredencial(data);
        res.status(201).json(novaCredencial);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Atualizar uma credencial por ID
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        const credencialAtualizada = await updateCredencial(Number(id), data);
        res.status(200).json(credencialAtualizada);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Deletar uma credencial por ID
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await deleteCredencial(Number(id));
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
