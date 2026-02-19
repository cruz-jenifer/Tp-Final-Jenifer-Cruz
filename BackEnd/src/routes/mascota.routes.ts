import { Router } from 'express';
import { MascotaController } from '../controllers/mascota.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validateMascota } from '../validators/mascota.validator';
import { checkRole } from '../middlewares/role.middleware';

const router = Router();

// APLICAR AUTH A TODAS LAS RUTAS
router.use(authMiddleware);

// MASCOTAS ADMIN
router.get('/admin/all', checkRole(['admin']), MascotaController.obtenerTodasLasMascotas);

// RUTAS GENERALES
router.get('/', MascotaController.listarMisMascotas);
router.post('/', validateMascota, MascotaController.crearMascota);
router.get('/:id', MascotaController.obtenerMascotaPorId);
router.delete('/:id', MascotaController.eliminarMascota);
router.put('/:id', validateMascota, MascotaController.actualizarMascota);

export default router;