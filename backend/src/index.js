import express from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import chatRoutes from './routes/chat.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api', chatRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.listen(env.port, () => {
  console.log(`Persona-AI backend running on http://localhost:${env.port}`);
});
