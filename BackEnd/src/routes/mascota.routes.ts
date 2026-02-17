
import { Router } from 'express';
import { MascotaController } from '../controllers/mascota.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// APLICAR MIDDLEWARE DE AUTH A TODAS LAS RUTAS
router.use(authMiddleware);

// /api/mascotas
router.get('/', MascotaController.listarMisMascotas);
router.post('/', MascotaController.crearMascota);
router.get('/:id', MascotaController.getMascotaById);
router.delete('/:id', MascotaController.eliminarMascota);

export default router;