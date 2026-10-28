import { Request, Response } from 'express';
import { UploadService } from '../services/UploadService';

const uploadService = new UploadService();

export class UploadController {
  async upload(req: Request, res: Response) {
    try {
      const file = req.file;
      if (!file) {
        return res.status(400).json({ error: 'Nenhum arquivo enviado' });
      }

      const result = await uploadService.saveFile(file);
      res.status(201).json({
        message: 'Arquivo enviado com sucesso',
        data: result,
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { fileName } = req.params;
      // Garantir que fileName seja string
      if (Array.isArray(fileName)) {
        return res.status(400).json({ error: 'Nome de arquivo inválido' });
      }
      const result = await uploadService.deleteFile(fileName);
      res.json(result);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }
}