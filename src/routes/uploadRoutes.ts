import { Router } from 'express';
import { upload } from '../config/multerConfig';
import { UploadController } from '../controllers/UploadController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();
const uploadController = new UploadController();

router.post(
  '/',
  authMiddleware, // <-- Ativado! Apenas usuários logados podem fazer upload
  upload.single('image'),
  uploadController.upload
);

export default router;