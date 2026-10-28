import { Router } from "express";
import { UsuarioController } from "../controllers/UsuarioController";
import { authMiddleware, verificarProprietario } from "../middlewares/authMiddleware";
import { isAdmin } from "../middlewares/roleMiddleware";

const router = Router();
const usuarioController = new UsuarioController();

// Rota trancada novamente! Só Admin logado pode criar outro Admin
router.post("/", authMiddleware, isAdmin, usuarioController.criar);

// Rotas protegidas por login
router.get("/", authMiddleware, isAdmin, usuarioController.listar);
router.put("/:id", authMiddleware, verificarProprietario, usuarioController.atualizar);
router.put("/:id/senha", authMiddleware, verificarProprietario, usuarioController.alterarSenha);
router.delete("/:id", authMiddleware, isAdmin, usuarioController.deletar);

export default router;