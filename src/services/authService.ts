import prisma from "../prisma/prismaClient";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { validarEmail } from "../utils/validators";

export const login = async (email: string, senha: string) => {
  if (!validarEmail(email)) {
    throw new Error("Email inválido");
  }

  let conta: any = null;
  let isCliente = false;

  // 1. Tenta buscar na tabela de ADMINISTRADORES
  conta = await prisma.usuarios.findUnique({
    where: { email }
  });

  // 2. Se não achar, busca na tabela de CLIENTES
  if (!conta) {
    conta = await prisma.clientes.findUnique({
      where: { email }
    });
    isCliente = true;
  }

  // Se não achou em nenhuma das duas, barra o acesso
  if (!conta) {
    throw new Error("Email ou senha inválidos");
  }

  if (conta.ativo === false) {
    throw new Error("Usuário desativado. Contate o administrador.");
  }

  if (!conta.senha) {
    throw new Error("Usuário sem senha cadastrada");
  }

  // Compara a senha digitada com o hash do banco
  const senhaValida = await bcrypt.compare(senha, conta.senha);

  if (!senhaValida) {
    throw new Error("Email ou senha inválidos");
  }

  // Garante a permissão correta no Token
  const permissao = conta.permissao || (isCliente ? 'CLIENTE' : 'ADMIN');

  // Segurança: Exige que a variável de ambiente exista
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error('ERRO CRÍTICO: JWT_SECRET não configurado.');
    throw new Error("Erro interno de configuração do servidor");
  }

  const token = jwt.sign(
    {
      id: conta.id,
      email: conta.email,
      permissao: permissao,
    },
    secret,
    { expiresIn: "1d" }
  );

  // Remove a senha antes de retornar para o front-end
  const { senha: _, ...contaSemSenha } = conta;

  return {
    usuario: contaSemSenha,
    token,
  };
};