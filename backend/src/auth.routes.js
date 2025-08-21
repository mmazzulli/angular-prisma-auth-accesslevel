// import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, authorizeRoles } from './auth.middleware.js';

import { Router } from 'express';
// import { prisma } from './prisma.js'; 

const router = Router();


// const router = express.Router();
const prisma = new PrismaClient();


// ======================
// Função para gerar token JWT
// ======================
function generateToken(user) {
  return jwt.sign(
    { id: user.id, role: user.role.toLowerCase() },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
}

// ======================
// Registro
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
    const validRoles = ['superadmin', 'empresa', 'funcionario', 'cliente'];
    const userRole = validRoles.includes(role?.toLowerCase()) ? role.toLowerCase() : 'cliente';

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, role: userRole }
    });

    const token = generateToken(user);
    res.json({ token, role: user.role });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar usuário' });
  }
});

// ======================
// Login
// ======================
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email e senha obrigatórios' });

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
// Rotas protegidas por role
// ======================


// ----------------------
// Superadmin
// Acessa todos os dashboards, visto apenas por ele mesmo
// ----------------------
router.get(
  '/superadmin',
  authenticateToken,
  authorizeRoles('superadmin'),
  async (req, res) => {
    try {
      const users = await prisma.user.findMany(); // todos os usuários
      res.json({ message: 'Bem-vindo, Superadmin!', users });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro ao buscar dados' });
    }
  }
);

// ----------------------
// Empresa
// Acessa: empresa (ela mesma), todos funcionários e clientes
// Visto por: superadmin
// ----------------------
router.get(
  '/empresa',
  authenticateToken,
  authorizeRoles('superadmin', 'empresa'),
  async (req, res) => {
    try {
      const users = await prisma.user.findMany({
        where: { role: { in: ['empresa', 'funcionario', 'cliente'] } },
      });
      res.json({ message: 'Bem-vindo, Empresa!', users });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro ao buscar dados' });
    }
  }
);

// ----------------------
// Funcionário
// Acessa: ele mesmo + todos clientes
// Visto por: superadmin + empresa
// ----------------------
router.get(
  '/funcionario',
  authenticateToken,
  authorizeRoles('superadmin', 'empresa', 'funcionario'),
  async (req, res) => {
    try {
      const users = await prisma.user.findMany({
        where: { role: { in: ['funcionario', 'cliente'] } },
      });
      res.json({ message: 'Bem-vindo, Funcionário!', users });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro ao buscar dados' });
    }
  }
);

// ----------------------
// Cliente
// Acessa: ele mesmo
// Visto por: superadmin + empresa + funcionario
// ----------------------
router.get(
  '/cliente',
  authenticateToken,
  authorizeRoles('superadmin', 'empresa', 'funcionario', 'cliente'),
  async (req, res) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.userId },
      });
      res.json({ message: 'Bem-vindo, Cliente!', user });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro ao buscar dados' });
    }
  }
);

export default router;
