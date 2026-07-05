import { Router } from 'express';
import { listPersonas } from '../personas/index.js';
import { chatWithPersona } from '../services/openaiService.js';

const router = Router();

router.get('/personas', (_req, res) => {
  res.json({ personas: listPersonas() });
});

router.post('/chat', async (req, res) => {
  try {
    const { personaId, messages } = req.body;

    if (!personaId || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'personaId and messages array are required' });
    }

    const result = await chatWithPersona(personaId, messages);
    res.json(result);
  } catch (error) {
    console.error('Chat error:', error.message);
    res.status(500).json({ error: error.message || 'Failed to process chat' });
  }
});

export default router;
