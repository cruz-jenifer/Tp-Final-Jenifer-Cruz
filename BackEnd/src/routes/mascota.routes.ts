
import { Router } from 'express';
import { MascotaController } from '../controllers/mascota.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// APLICAR MIDDLEWARE DE AUTH A TODAS LAS RUTAS
router.use(authMiddleware);

// MASCOTAS ADMIN
import { checkRole } from '../middlewares/role.middleware';
router.get('/admin/all', checkRole(['admin']), MascotaController.getAllMascotas);

// RUTAS GENERALES
router.get('/', MascotaController.listarMisMascotas);
router.post('/', MascotaController.crearMascota);
router.get('/:id', MascotaController.getMascotaById);
router.delete('/:id', MascotaController.eliminarMascota);
router.put('/:id', MascotaController.actualizarMascota);

export default router;