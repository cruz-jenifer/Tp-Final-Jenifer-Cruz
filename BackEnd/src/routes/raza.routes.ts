import { Router } from 'express';
import { RazaController } from '../controllers/raza.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.use(authMiddleware);

// LISTADO DE RAZAS
router.get('/', (req, res, next) => RazaController.obtenerTodas(req, res, next));

export default router;
