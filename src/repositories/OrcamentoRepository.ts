import prisma from "../prisma/prismaClient";

export class OrcamentoRepository {
  async findAll(clienteId?: number) {
    return prisma.orcamentos.findMany({
      where: { 
        deletado_em: null,
        ...(clienteId && { id_cliente: clienteId })
      },
      include: {
        usuarios: { select: { id: true, nome: true, email: true } },
        clientes: { select: { id: true, nome: true, cpf: true, telefone: true } },
        veiculos: { select: { id: true, placa: true, modelo: true, foto: true } },
        departamentos: true,
      },
      orderBy: { criado_em: "desc" },
    });
  }

  async findAllPaginated(
    skip: number, 
    limit: number, 
    etapa?: string, 
    clienteId?: number,
    idDepartamento?: number,
    busca?: string
  ) {
    const where: any = { 
      deletado_em: null,
      ...(clienteId && { id_cliente: clienteId })
    };
    
    if (etapa && etapa !== 'todas') {
      where.etapa = etapa;
    }

    if (idDepartamento) {
      where.id_departamento = idDepartamento;
    }

    if (busca) {
      where.OR = [
        { veiculos: { placa: { contains: busca } } },
        { veiculos: { modelo: { contains: busca } } },
        { clientes: { nome: { contains: busca } } },
      ];
    }
    
    return prisma.orcamentos.findMany({
      where,
      skip,
      take: limit,
      include: {
        usuarios: { select: { id: true, nome: true, email: true } },
        clientes: { select: { id: true, nome: true, cpf: true, telefone: true } },
        veiculos: { select: { id: true, placa: true, modelo: true, foto: true } },
        departamentos: true,
      },
      orderBy: { criado_em: "desc" },
    });
  }

  async countAll(
    etapa?: string, 
    clienteId?: number,
    idDepartamento?: number,
    busca?: string
  ) {
    const where: any = { 
      deletado_em: null,
      ...(clienteId && { id_cliente: clienteId })
    };
    
    if (etapa && etapa !== 'todas') {
      where.etapa = etapa;
    }

    if (idDepartamento) {
      where.id_departamento = idDepartamento;
    }

    if (busca) {
      where.OR = [
        { veiculos: { placa: { contains: busca } } },
        { veiculos: { modelo: { contains: busca } } },
        { clientes: { nome: { contains: busca } } },
      ];
    }
    
    return prisma.orcamentos.count({ where });
  }

  async findById(id: number) {
    return prisma.orcamentos.findFirst({
      where: { 
        id,
        deletado_em: null 
      },
      include: {
        usuarios: { select: { id: true, nome: true, email: true } },
        clientes: { select: { id: true, nome: true, cpf: true, telefone: true } },
        veiculos: { select: { id: true, placa: true, modelo: true, foto: true } },
        departamentos: true,
      },
    });
  }

  async create(data: any) {
    return prisma.orcamentos.create({ data });
  }

  async update(id: number, data: any) {
    return prisma.orcamentos.update({
      where: { id },
      data,
    });
  }

  async softDelete(id: number) {
    return prisma.orcamentos.update({
      where: { id },
      data: { deletado_em: new Date() },
    });
  }
}