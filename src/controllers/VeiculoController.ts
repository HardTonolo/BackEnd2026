import { Request, Response } from "express";
import { VeiculoService } from "../services/VeiculoService";

interface CustomRequest extends Request {
  user?: {
    id: number;
    email: string;
    permissao: string;
  };
}

const veiculoService = new VeiculoService();

export class VeiculoController {
  async listar(req: CustomRequest, res: Response) {
    try {
      const page = req.query.page ? Number(req.query.page) : undefined;
      const limit = req.query.limit ? Number(req.query.limit) : undefined;
      
      // Passamos o usuário logado para o service saber se filtra ou não
      const resultado = await veiculoService.listarComPaginacao(page, limit, req.user);
      res.json(resultado);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async buscarPorId(req: CustomRequest, res: Response) {
    try {
      const id = Number(req.params.id);
      const veiculo = await veiculoService.buscarPorId(id, req.user);
      res.json({ data: veiculo });
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }

  async criar(req: CustomRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Usuário não autenticado" });
      }

      const foto = req.file ? req.file.filename : null;

      const dadosParaCriar = {
        ...req.body,
        foto: foto
      };
      
      const veiculo = await veiculoService.criar(dadosParaCriar, req.user);
      res.status(201).json({ data: veiculo, message: "Veículo criado com sucesso" });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async atualizar(req: CustomRequest, res: Response) {
    try {
      // Correção: Verifica se o usuário existe antes de passar para o service
      if (!req.user) {
        return res.status(401).json({ error: "Usuário não autenticado" });
      }

      const id = Number(req.params.id);
      const foto = req.file ? req.file.filename : undefined;
      
      const dadosParaAtualizar = {
        ...req.body,
        ...(foto && { foto })
      };

      const veiculo = await veiculoService.atualizar(id, dadosParaAtualizar, req.user);
      res.json({ data: veiculo, message: "Veículo atualizado com sucesso" });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async deletar(req: CustomRequest, res: Response) {
    try {
      // Correção: Verifica se o usuário existe antes de passar para o service
      if (!req.user) {
        return res.status(401).json({ error: "Usuário não autenticado" });
      }

      const id = Number(req.params.id);
      const resultado = await veiculoService.deletar(id, req.user);
      res.json(resultado);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}