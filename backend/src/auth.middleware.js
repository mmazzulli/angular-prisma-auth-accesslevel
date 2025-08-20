import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// Middleware de autenticação
export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Token não fornecido' });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: 'Token inválido' });

    req.userId = decoded.userId;
    req.userRole = decoded.role; // 👈 Guardamos o role
    next();
  });
}

// Middleware de autorização por role
export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.userRole) {
      return res.status(403).json({ error: 'Role não encontrado' });
    }
    if (!roles.includes(req.userRole)) {
      return res.status(403).json({ error: 'Acesso negado para seu papel' });
    }
    next();
  };
}