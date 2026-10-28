import { Router } from "express";
import { OrcamentoController } from "../controllers/OrcamentoController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { isAdmin } from "../middlewares/roleMiddleware"; // <-- Importação adicionada

const router = Router();
const orcamentoController = new OrcamentoController();

router.use(authMiddleware);

// Rotas de leitura (o Controller vai garantir que o cliente só veja os próprios orçamentos)
router.get("/", orcamentoController.listar);
router.get("/:id", orcamentoController.buscarPorId);

// Rotas de escrita (exclusivas do ADMIN)
router.post("/", isAdmin, orcamentoController.criar);
router.put("/:id", isAdmin, orcamentoController.atualizar);
router.delete("/:id", isAdmin, orcamentoController.deletar);

export default router;