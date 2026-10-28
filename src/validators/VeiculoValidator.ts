export class VeiculoValidator {
  private static validarPlaca(placa: string) {
    // Limpa a placa (remove hífens e espaços) e deixa maiúscula
    const placaLimpa = placa.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    
    // Padrão antigo: 3 letras e 4 números (ex: ABC1234)
    const padraoAntigo = /^[A-Z]{3}[0-9]{4}$/;
    // Padrão Mercosul: 3 letras, 1 número, 1 letra, 2 números (ex: ABC1D23)
    const padraoMercosul = /^[A-Z]{3}[0-9][A-Z][0-9]{2}$/;
    
    return padraoAntigo.test(placaLimpa) || padraoMercosul.test(placaLimpa);
  }

  static validateCreate(data: { placa: string; modelo: string }) {
    if (!data.placa) {
      throw new Error("Placa é obrigatória");
    }

    if (!data.modelo) {
      throw new Error("Modelo é obrigatório");
    }

    if (!this.validarPlaca(data.placa)) {
      throw new Error("Placa inválida. Use o formato ABC1234 (antigo) ou ABC1D23 (Mercosul).");
    }

    return true;
  }

  static validateUpdate(data: { placa?: string; modelo?: string }) {
    if (data.placa) {
      if (!this.validarPlaca(data.placa)) {
        throw new Error("Placa inválida. Use o formato ABC1234 (antigo) ou ABC1D23 (Mercosul).");
      }
    }

    return true;
  }
}