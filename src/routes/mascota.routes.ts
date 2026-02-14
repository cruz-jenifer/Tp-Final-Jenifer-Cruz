import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import * as mascotaController from '../controllers/mascota.controller';

const router = Router();

// PROTECCION DE TODAS LAS RUTAS
router.use(authMiddleware);

// RUTAS DE MASCOTAS (ENDPOINT: /api/mascotas)
router.post('/', mascotaController.createMascota);
router.get('/', mascotaController.getAll);
router.get('/:id', mascotaController.getOne);
router.put('/:id', mascotaController.updateMascota);
router.delete('/:id', mascotaController.deleteMascota);

export default router;