import { Router } from "express";
import { EnderecoController } from "../controllers/EnderecoController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { isAdmin } from "../middlewares/roleMiddleware"; // <-- Importação adicionada

const router = Router();
const enderecoController = new EnderecoController();

router.use(authMiddleware);

// Apenas o ADMIN pode listar TODOS os endereços do sistema
router.get("/", isAdmin, enderecoController.listar); 

// Rotas que podem ser acessadas pelo cliente (o Controller vai validar se o clienteId é o dono)
router.get("/cliente/:clienteId", enderecoController.listarPorCliente);
router.get("/:id", enderecoController.buscarPorId);
router.post("/", enderecoController.criar);
router.put("/:id", enderecoController.atualizar);
router.delete("/:id", enderecoController.deletar);

export default router;