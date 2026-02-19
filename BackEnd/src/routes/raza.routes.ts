import { Router } from 'express';
import { RazaController } from '../controllers/raza.controller';
import { autenticar } from '../middlewares/auth.middleware';

const router = Router();

router.use(autenticar);

// LISTADO DE RAZAS
router.get('/', (req, res, next) => RazaController.obtenerTodas(req, res, next));

export default router;
