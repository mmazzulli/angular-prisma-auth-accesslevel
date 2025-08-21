import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// ======================
// Autenticação JWT
// ======================
export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];
  if (!authHeader) return res.status(401).json({ error: 'Token não fornecido' });

  const [scheme, token] = authHeader.split(' ');
  if (!token || String(scheme).toLowerCase() !== 'bearer') {
    return res.status(401).json({ error: 'Formato inválido (use Bearer <token>)' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      const isExpired = err.name === 'TokenExpiredError';
      return res.status(401).json({ error: isExpired ? 'Token expirado' : 'Token inválido' });
    }

    req.userId = decoded.id;
    req.userRole = (decoded.role || '').toLowerCase();
    next();
  });
}

// ======================
// Autorização por roles
// ======================
export function authorizeRoles(...allowedRoles) {
  const normalizedAllowed = allowedRoles.map(r => r.toLowerCase());

  return (req, res, next) => {
    if (!req.userRole) return res.status(401).json({ error: 'Não autenticado' });

    // superadmin pode acessar tudo
    if (req.userRole === 'superadmin') return next();

    if (normalizedAllowed.length > 0 && !normalizedAllowed.includes(req.userRole)) {
      return res.status(403).json({ error: 'Acesso negado para seu papel' });
    }

    next();
  };
}
