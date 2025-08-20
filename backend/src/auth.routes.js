import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Função para gerar token JWT
function generateToken(user) {
  return jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
}

// Middleware de autorização por roles
export function authorizeRoles(...roles) {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'Não autorizado' });

    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (!roles.includes(decoded.role)) {
        return res.status(403).json({ error: 'Acesso negado para seu papel' });
      }
      req.user = decoded;
      next();
    } catch (err) {
      return res.status(401).json({ error: 'Token inválido' });
    }
  };
}

// ======================
// Rota de registro
// ======================
router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Nome, email e senha são obrigatórios' });
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return res.status(400).json({ error: 'Usuário já existe' });

    const hashedPassword = await bcrypt.hash(password, 10);

    // Garante que o role seja válido
    const validRoles = ['superadmin', 'empresa', 'funcionarios', 'clientes'];
    const userRole = validRoles.includes(role) ? role : 'clientes';

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, role: userRole },
    });

    const token = generateToken(user);
    res.json({ token, role: user.role });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar usuário' });
  }
});

// ======================
// Rota de login
// ======================
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios' });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: 'Credenciais inválidas' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Credenciais inválidas' });

    const token = generateToken(user);
    res.json({ token, role: user.role });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao fazer login' });
  }
});

// ======================
// Rotas protegidas
// ======================

// Dashboard do SuperAdmin
router.get('/dashboard-superadmin',
  authorizeRoles('superadmin'),
  (req, res) => {
    res.json({ message: 'Bem-vindo, SuperAdmin!' });
  }
);

// Dashboard da Empresa
router.get('/dashboard-empresa',
  authorizeRoles('empresa'),
  (req, res) => {
    res.json({ message: 'Bem-vindo, Empresa!' });
  }
);

// Dashboard de Funcionários
router.get('/dashboard-funcionarios',
  authorizeRoles('funcionarios'),
  (req, res) => {
    res.json({ message: 'Bem-vindo, Funcionários!' });
  }
);

// Dashboard de Clientes
router.get('/dashboard-clientes',
  authorizeRoles('clientes'),
  (req, res) => {
    res.json({ message: 'Bem-vindo, Clientes!' });
  }
);

export default router;