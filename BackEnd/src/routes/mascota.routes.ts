import { Router } from 'express';
import { MascotaController } from '../controllers/mascota.controller';
import { autenticar, autorizar } from '../middlewares/auth.middleware';
import { validateMascota } from '../validators/mascota.validator';

const router = Router();

// APLICAR AUTH A TODAS LAS RUTAS
router.use(autenticar);

// MASCOTAS ADMIN
router.get('/admin/all', autorizar(['admin']), MascotaController.obtenerTodasLasMascotas);

// RUTAS GENERALES
router.get('/', MascotaController.listarMisMascotas);
router.post('/', validateMascota, MascotaController.crearMascota);
router.get('/:id', MascotaController.obtenerMascotaPorId);
router.delete('/:id', MascotaController.eliminarMascota);
router.put('/:id', validateMascota, MascotaController.actualizarMascota);

export default router;