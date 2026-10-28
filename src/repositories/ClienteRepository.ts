import prisma from "../prisma/prismaClient";

export class ClienteRepository {
  async findAll() {
    return prisma.clientes.findMany({
      where: { deletado_em: null },
    });
  }

  async findAllPaginated(skip: number, limit: number) {
    return prisma.clientes.findMany({
      where: { deletado_em: null },
      skip,
      take: limit,
      orderBy: { criado_em: "desc" },
    });
  }

  async countAll() {
    return prisma.clientes.count({
      where: { deletado_em: null },
    });
  }

  async findById(id: number) {
    return prisma.clientes.findFirst({ 
      where: { 
        id,
        deletado_em: null 
      },
      // ADICIONADO: Traz as ordens de serviço ativas deste cliente
      include: {
        orcamentos: {
          where: { deletado_em: null }
        }
      }
    });
  }

  async findByCpf(cpf: string) {
    return prisma.clientes.findFirst({ 
      where: { 
        cpf,
        deletado_em: null 
      } 
    });
  }

  async findByEmail(email: string) {
    return prisma.clientes.findFirst({ 
      where: { 
        email,
        deletado_em: null 
      } 
    });
  }

  async create(data: any) {
    return prisma.clientes.create({ data });
  }

  async update(id: number, data: any) {
    return prisma.clientes.update({
      where: { id },
      data,
    });
  }

  async softDelete(id: number) {
    return prisma.clientes.update({
      where: { id },
      data: { deletado_em: new Date() },
    });
  }
}