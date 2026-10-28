import prisma from "../prisma/prismaClient";

export class VeiculoRepository {
  async findAll(clienteId?: number) {
    return prisma.veiculos.findMany({
      where: { 
        deletado_em: null,
        ...(clienteId && { id_cliente: clienteId }) 
      },
      include: {
        clientes: true,
        usuarios: true,
      },
    });
  }

  async findAllPaginated(skip: number, limit: number, clienteId?: number) {
    return prisma.veiculos.findMany({
      where: { 
        deletado_em: null,
        ...(clienteId && { id_cliente: clienteId })
      },
      skip,
      take: limit,
      include: {
        clientes: true,
        usuarios: true,
        // Adicionado para o Dashboard do Cliente
        orcamentos: {
          where: { deletado_em: null },
          include: { departamentos: true },
          orderBy: { criado_em: "desc" }
        }
      },
      orderBy: { criado_em: "desc" },
    });
  }

  async countAll(clienteId?: number) {
    return prisma.veiculos.count({
      where: { 
        deletado_em: null,
        ...(clienteId && { id_cliente: clienteId })
      },
    });
  }

  async findById(id: number) {
    return prisma.veiculos.findUnique({
      where: { id },
      include: {
        clientes: true,
        usuarios: true,
        orcamentos: {
          where: { deletado_em: null },
          include: { departamentos: true },
          orderBy: { criado_em: "desc" }
        }
      },
    });
  }

  async findByPlaca(placa: string) {
    return prisma.veiculos.findFirst({ 
      where: { 
        placa,
        deletado_em: null 
      } 
    });
  }

  async create(data: any) {
    return prisma.veiculos.create({ data });
  }

  async update(id: number, data: any) {
    return prisma.veiculos.update({
      where: { id },
      data,
    });
  }

  async softDelete(id: number) {
    return prisma.veiculos.update({
      where: { id },
      data: { deletado_em: new Date() },
    });
  }
}