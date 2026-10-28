import { Request, Response } from "express";
import { UsuarioService } from "../services/UsuarioService";

interface CustomRequest extends Request {
  user?: {
    id: number;
    email: string;
    permissao: string;
  };
}

const usuarioService = new UsuarioService();

export class UsuarioController {
  async listar(req: CustomRequest, res: Response) {
    try {
      const page = req.query.page ? Number(req.query.page) : undefined;
      const limit = req.query.limit ? Number(req.query.limit) : undefined;
      
      const resultado = await usuarioService.listarComPaginacao(page, limit);
      res.json(resultado);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async criar(req: CustomRequest, res: Response) {
    try {
      const usuario = await usuarioService.criar(req.body, req.user);
      res.status(201).json({ data: usuario, message: "Administrador criado com sucesso" });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async atualizar(req: CustomRequest, res: Response) {
    try {
      const id = Number(req.params.id);
      const usuario = await usuarioService.atualizar(id, req.body, req.user);
      res.json({ data: usuario, message: "Usuário atualizado com sucesso" });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async deletar(req: CustomRequest, res: Response) {
    try {
      const id = Number(req.params.id);
      const resultado = await usuarioService.deletar(id, req.user);
      res.json(resultado);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async alterarSenha(req: CustomRequest, res: Response) {
    try {
      const id = Number(req.params.id);
      const { senhaAtual, novaSenha } = req.body;
      
      if (!senhaAtual || !novaSenha) {
        return res.status(400).json({ error: "Senha atual e nova senha são obrigatórias" });
      }
      
      const resultado = await usuarioService.alterarSenha(id, senhaAtual, novaSenha, req.user);
      res.json(resultado);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}