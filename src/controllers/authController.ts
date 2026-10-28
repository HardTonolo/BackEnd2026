import { Request, Response } from "express";
import { login } from "../services/authService";

export const loginController = async (req: Request, res: Response) => {
  try {
    const { email, senha } = req.body;

    // Validação básica para não chamar o service sem os dados
    if (!email || !senha) {
      return res.status(400).json({ error: "E-mail e senha são obrigatórios." });
    }

    const resultado = await login(email, senha);

    return res.json(resultado);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(400).json({ error: error.message });
    }
    return res.status(400).json({ error: "Erro inesperado ao realizar login." });
  }
};