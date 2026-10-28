import { Router } from "express";
import { ClienteController } from "../controllers/ClienteController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { isAdmin } from "../middlewares/roleMiddleware";

const router = Router();
const clienteController = new ClienteController();

// ==========================================
// ROTA PÚBLICA (Não exige login)
// Usada pela tela de Cadastro do site
// ==========================================
router.post("/", clienteController.criar);

// ==========================================
// ROTAS PROTEGIDAS (Exigem login)
// ==========================================
router.use(authMiddleware);

// Rotas que só o ADMIN pode acessar
router.get("/", isAdmin, clienteController.listar);
router.get("/:id", isAdmin, clienteController.buscarPorId);
router.delete("/:id", isAdmin, clienteController.deletar);

// Rota de atualização (Admin edita todos, Cliente edita apenas o próprio - validação no Controller)
router.put("/:id", clienteController.atualizar);

export default router;