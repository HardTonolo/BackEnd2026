import { Router } from "express";
import { VeiculoController } from "../controllers/VeiculoController";
import { authMiddleware } from "../middlewares/authMiddleware";
// import { isAdmin } from "../middlewares/roleMiddleware"; // Não é mais necessário aqui
import { upload } from "../config/multerConfig";

const router = Router();
const veiculoController = new VeiculoController();

router.use(authMiddleware);

router.get("/", veiculoController.listar); 
router.get("/:id", veiculoController.buscarPorId);

// O Multer precisa estar nessas rotas para ler os campos (placa, modelo, foto)
router.post("/", upload.single('foto'), veiculoController.criar);
router.put("/:id", upload.single('foto'), veiculoController.atualizar);

// O isAdmin foi removido daqui. 
// O Controller vai chamar o Service, que valida se o cliente é o dono do veículo.
router.delete("/:id", veiculoController.deletar);

export default router;