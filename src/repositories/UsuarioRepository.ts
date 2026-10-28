import prisma from "../prisma/prismaClient";

export class UsuarioRepository {
  async findAll() {
    return prisma.usuarios.findMany({
      where: { deletado_em: null },
      select: {
        id: true,
        nome: true,
        email: true,
        cpf: true,
        permissao: true,
        ativo: true,
        criado_em: true,
        atualizado_em: true,
      },
      orderBy: { criado_em: "desc" },
    });
  }

  async findAllPaginated(skip: number, limit: number) {
    return prisma.usuarios.findMany({
      where: { deletado_em: null },
      skip,
      take: limit,
      select: {
        id: true,
        nome: true,
        email: true,
        cpf: true,
        permissao: true,
        ativo: true,
        criado_em: true,
        atualizado_em: true,
      },
      orderBy: { criado_em: "desc" },
    });
  }

  async countAll() {
    return prisma.usuarios.count({
      where: { deletado_em: null },
    });
  }

  async findById(id: number) {
    // Alterado para findFirst para permitir o filtro de deletado_em
    return prisma.usuarios.findFirst({
      where: { 
        id,
        deletado_em: null 
      },
      select: {
        id: true,
        nome: true,
        email: true,
        cpf: true,
        senha: true, // Necessário para a alteração de senha
        permissao: true,
        ativo: true,
        criado_em: true,
        atualizado_em: true,
      },
    });
  }

  async findByEmail(email: string) {
    // Alterado para findFirst para garantir que não pegue usuários soft-deleted
    return prisma.usuarios.findFirst({ 
      where: { 
        email,
        deletado_em: null 
      } 
    });
  }

  async findByCpf(cpf: string) {
    return prisma.usuarios.findFirst({ 
      where: { 
        cpf,
        deletado_em: null 
      } 
    });
  }

  async create(data: any) {
    return prisma.usuarios.create({ data });
  }

  async update(id: number, data: any) {
    return prisma.usuarios.update({
      where: { id },
      data,
    });
  }

  async softDelete(id: number) {
    return prisma.usuarios.update({
      where: { id },
      data: {
        deletado_em: new Date(),
        ativo: false,
      },
    });
  }
}