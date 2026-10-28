import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface TokenPayload {
  id: number;
  email: string;
  permissao: string;
}

interface CustomRequest extends Request {
  user?: {
    id: number;
    email: string;
    permissao: string;
  };
}

export const authMiddleware = (req: CustomRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  const [, token] = authHeader.split(' ');

  try {
    // Removido o fallback inseguro. O servidor precisa da variável de ambiente.
    const secret = process.env.JWT_SECRET;
    
    if (!secret) {
      console.error('ERRO CRÍTICO: JWT_SECRET não configurado nas variáveis de ambiente.');
      return res.status(500).json({ error: 'Erro interno de configuração do servidor' });
    }

    const decoded = jwt.verify(token, secret) as TokenPayload;
    
    req.user = {
      id: decoded.id,
      email: decoded.email,
      permissao: decoded.permissao,
    };
    
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido ou expirado' });
  }
};

export const verificarProprietario = (req: CustomRequest, res: Response, next: NextFunction) => {
  const userId = Number(req.params.id);
  
  if (!req.user) {
    return res.status(401).json({ error: 'Usuário não autenticado' });
  }
  
  // Se não for ADMIN E o ID não for o dele mesmo, bloqueia.
  if (req.user.permissao !== 'ADMIN' && req.user.id !== userId) {
    return res.status(403).json({ error: 'Você só pode editar seu próprio perfil' });
  }
  
  next();
};