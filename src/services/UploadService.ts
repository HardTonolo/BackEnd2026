import fs from 'fs';
import path from 'path';

export class UploadService {
  async saveFile(file: Express.Multer.File) {
    if (!file) {
      throw new Error('Nenhum arquivo enviado');
    }

    const filePath = path.join('uploads', file.filename);

    return {
      originalName: file.originalname,
      fileName: file.filename,
      path: filePath,
      size: file.size,
      mimetype: file.mimetype,
    };
  }

  async deleteFile(fileName: string) {
    const filePath = path.join('uploads', fileName);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return { message: 'Arquivo removido com sucesso' };
    }
    throw new Error('Arquivo não encontrado');
  }
}