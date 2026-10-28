import { OrcamentoRepository } from "../repositories/OrcamentoRepository";
import { VeiculoRepository } from "../repositories/VeiculoRepository";
import { OrcamentoValidator } from "../validators/OrcamentoValidator";
import { ICreateOrcamentoDTO, IUpdateOrcamentoDTO } from "../types/orcamento";
import { getPaginationParams, formatPaginatedResponse } from "../utils/pagination";

interface UserPayload {
  id: number;
  permissao: string;
}

export class OrcamentoService {
  private repository: OrcamentoRepository;
  private veiculoRepository: VeiculoRepository;

  constructor() {
    this.repository = new OrcamentoRepository();
    this.veiculoRepository = new VeiculoRepository();
  }

  async listarComPaginacao(
    page?: number, 
    limit?: number, 
    etapa?: string, 
    user?: UserPayload,
    idDepartamento?: number,
    busca?: string
  ) {
    const { page: pageNum, limit: limitNum, skip } = getPaginationParams({ page, limit });
    
    const clienteId = user?.permissao === 'CLIENTE' ? user.id : undefined;

    const [orcamentos, total] = await Promise.all([
      this.repository.findAllPaginated(skip, limitNum, etapa, clienteId, idDepartamento, busca),
      this.repository.countAll(etapa, clienteId, idDepartamento, busca),
    ]);

    return formatPaginatedResponse(orcamentos, total, pageNum, limitNum);
  }

  async listarTodos() {
    return this.repository.findAll();
  }

  async buscarPorId(id: number, user?: UserPayload) {
    const orcamento = await this.repository.findById(id);
    if (!orcamento) throw new Error("Orçamento não encontrado");

    if (user?.permissao === 'CLIENTE' && orcamento.id_cliente !== user.id) {
      throw new Error("Acesso negado a este orçamento");
    }

    return orcamento;
  }

  async criar(data: ICreateOrcamentoDTO, usuarioId: number, user?: UserPayload) {
    if (user?.permissao !== 'ADMIN') {
      throw new Error("Apenas administradores podem criar ordens de serviço.");
    }

    OrcamentoValidator.validateCreate(data);
    this.validarDatas(data.data_inicio, data.data_termino);
    
    // --- CORREÇÃO AQUI: Forçando Number() nos IDs ---
    if (data.id_veiculo && data.id_cliente) {
      const veiculo = await this.veiculoRepository.findById(Number(data.id_veiculo));
      
      if (!veiculo) throw new Error("Veículo não encontrado.");
      
      // Comparação segura entre números
      if (Number(veiculo.id_cliente) !== Number(data.id_cliente)) {
        throw new Error("O veículo selecionado não pertence a este cliente.");
      }
    }

    return this.repository.create(this.montarDadosCriacao(data, usuarioId));
  }

  async atualizar(id: number, data: IUpdateOrcamentoDTO, user?: UserPayload) {
    if (user?.permissao !== 'ADMIN') {
      throw new Error("Apenas administradores podem atualizar ordens de serviço.");
    }

    await this.buscarPorId(id, user);
    OrcamentoValidator.validateUpdate(data);
    this.validarDatas(data.data_inicio, data.data_termino);
    
    return this.repository.update(id, this.montarDadosAtualizacao(data));
  }

  async deletar(id: number, user?: UserPayload) {
    if (user?.permissao !== 'ADMIN') {
      throw new Error("Apenas administradores podem excluir ordens de serviço.");
    }

    await this.buscarPorId(id, user);
    await this.repository.softDelete(id);
    return { message: "Orçamento deletado com sucesso" };
  }

  private validarDatas(dataInicio?: Date | string | null, dataTermino?: Date | string | null) {
    if (dataInicio && dataTermino) {
      const inicio = new Date(dataInicio);
      const termino = new Date(dataTermino);
      
      if (termino < inicio) {
        throw new Error("A data de previsão de saída não pode ser anterior à data de entrada.");
      }
    }
  }

  private montarDadosCriacao(data: ICreateOrcamentoDTO, usuarioId: number) {
    return {
      etapa: data.etapa || "orçamento",
      valor_inicial: data.valor_inicial || null,
      valor_final: data.valor_final || null,
      data_inicio: data.data_inicio || new Date(),
      data_termino: data.data_termino || null,
      descricao: data.descricao || null,
      id_usuario: usuarioId,
      id_cliente: Number(data.id_cliente),      // <-- Forçando número
      id_veiculo: Number(data.id_veiculo),      // <-- Forçando número
      id_departamento: data.id_departamento ? Number(data.id_departamento) : null,
    };
  }

  private montarDadosAtualizacao(data: IUpdateOrcamentoDTO) {
    return {
      etapa: data.etapa,
      valor_inicial: data.valor_inicial,
      valor_final: data.valor_final,
      data_inicio: data.data_inicio,
      data_termino: data.data_termino,
      descricao: data.descricao,
      id_cliente: data.id_cliente ? Number(data.id_cliente) : undefined, // <-- Forçando número
      id_veiculo: data.id_veiculo ? Number(data.id_veiculo) : undefined, // <-- Forçando número
      id_departamento: data.id_departamento ? Number(data.id_departamento) : undefined,
      atualizado_em: new Date(),
    };
  }
} 