import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './auth.routes.js'; // 👈 ajusta caminho conforme a pasta

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Rota de saúde (teste rápido)
app.get('/health', (_req, res) => res.json({ ok: true }));

// Rotas de autenticação (com prefixo /api/auth)
app.use('/api/auth', authRoutes);

// Porta com fallback para 3000 se não tiver no .env
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});