import { Request, Response, NextFunction } from 'express';

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  // O authMiddleware já deve ter rodado antes e preenchido req.user
  const user = (req as any).user;

  if (!user) {
    return res.status(401).json({ error: 'Usuário não autenticado.' });
  }

  // Verifica se a permissão gravada no banco (e que veio no token) é ADMIN
  if (user.permissao !== 'ADMIN') {
    return res.status(403).json({ error: 'Acesso negado. Apenas administradores podem acessar este recurso.' });
  }

  // Se for ADMIN, deixa a requisição continuar
  next();
};