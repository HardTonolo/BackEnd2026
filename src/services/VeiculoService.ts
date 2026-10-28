import { VeiculoRepository } from "../repositories/VeiculoRepository";
import { VeiculoValidator } from "../validators/VeiculoValidator";
import { ICreateVeiculoDTO, IUpdateVeiculoDTO } from "../types/veiculo";
import { getPaginationParams, formatPaginatedResponse } from "../utils/pagination";

interface UserPayload {
  id: number;
  permissao: string;
}

export class VeiculoService {
  private repository: VeiculoRepository;

  constructor() {
    this.repository = new VeiculoRepository();
  }

  async listarComPaginacao(page?: number, limit?: number, user?: UserPayload) {
    const { page: pageNum, limit: limitNum, skip } = getPaginationParams({ page, limit });
    
    // Se for CLIENTE, filtra para ver apenas os veículos dele
    const clienteId = user?.permissao === 'CLIENTE' ? user.id : undefined;

    const [veiculos, total] = await Promise.all([
      this.repository.findAllPaginated(skip, limitNum, clienteId),
      this.repository.countAll(clienteId),
    ]);

    return formatPaginatedResponse(veiculos, total, pageNum, limitNum);
  }

  async listarTodos() {
    return this.repository.findAll();
  }

  async buscarPorId(id: number, user?: UserPayload) {
    const veiculo = await this.repository.findById(id);
    if (!veiculo) throw new Error("Veículo não encontrado");

    // Se for CLIENTE, garante que ele só busque o próprio veículo
    if (user?.permissao === 'CLIENTE' && veiculo.id_cliente !== user.id) {
      throw new Error("Acesso negado a este veículo");
    }

    return veiculo;
  }

  async criar(data: ICreateVeiculoDTO, user: UserPayload) {
    // Regra do sistema: Admin não cadastra veículos
    if (user.permissao === 'ADMIN') {
      throw new Error("Administradores não podem cadastrar veículos pelo sistema.");
    }

    this.validarCriacao(data);
    await this.verificarPlacaUnica(data.placa);
    
    // Força o veículo a pertencer ao cliente logado
    return this.repository.create(this.montarDadosCriacao(data, user.id));
  }

  async atualizar(id: number, data: IUpdateVeiculoDTO, user: UserPayload) {
    // Regra do sistema: Admin não edita veículos
    if (user.permissao === 'ADMIN') {
      throw new Error("Administradores não podem editar veículos pelo sistema.");
    }

    // Verifica se o veículo existe e se pertence ao cliente
    await this.buscarPorId(id, user); 
    
    this.validarAtualizacao(data);
    await this.verificarPlacaUnicaAtualizacao(data.placa, id);
    
    return this.repository.update(id, this.montarDadosAtualizacao(data));
  }

  async deletar(id: number, user: UserPayload) {
    // Busca o veículo (o buscarPorId já valida se o cliente é o dono)
    const veiculo = await this.buscarPorId(id, user);

    // Regra de integridade: Bloqueia a exclusão se houver ordens de serviço ativas vinculadas
    if (veiculo.orcamentos && veiculo.orcamentos.length > 0) {
      throw new Error("Não é possível excluir este veículo, pois ele possui ordens de serviço vinculadas.");
    }
    
    await this.repository.softDelete(id);
    return { message: "Veículo deletado com sucesso" };
  }

  // Métodos auxiliares
  private validarCriacao(data: ICreateVeiculoDTO) {
    VeiculoValidator.validateCreate(data);
  }

  private validarAtualizacao(data: IUpdateVeiculoDTO) {
    VeiculoValidator.validateUpdate(data);
  }

  private async verificarPlacaUnica(placa: string) {
    // Limpa a placa antes de buscar no banco
    const placaLimpa = placa.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    const existe = await this.repository.findByPlaca(placaLimpa);
    if (existe) throw new Error("Placa já cadastrada no sistema");
  }

  private async verificarPlacaUnicaAtualizacao(placa?: string, id?: number) {
    if (!placa) return;
    
    // Limpa a placa antes de buscar no banco
    const placaLimpa = placa.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    const existe = await this.repository.findByPlaca(placaLimpa);
    
    if (existe && existe.id !== id) throw new Error("Placa já cadastrada no sistema");
  }

  private montarDadosCriacao(data: ICreateVeiculoDTO, clienteId: number) {
    return {
      // Limpa a placa para salvar no banco sem hífen
      placa: data.placa.replace(/[^a-zA-Z0-9]/g, '').toUpperCase(),
      modelo: data.modelo,
      id_cliente: clienteId, 
      id_usuario: null, 
      foto: data.foto || null,
    };
  }

  private montarDadosAtualizacao(data: IUpdateVeiculoDTO) {
    return {
      // Limpa a placa para salvar no banco sem hífen
      placa: data.placa ? data.placa.replace(/[^a-zA-Z0-9]/g, '').toUpperCase() : undefined,
      modelo: data.modelo,
      foto: data.foto,
      atualizado_em: new Date(),
    };
  }
}