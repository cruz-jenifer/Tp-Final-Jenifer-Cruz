import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import { checkRole } from '../middlewares/role.middleware';
import * as historialController from '../controllers/historial.controller';

const router = Router();

// APLICAR SEGURIDAD A TODO EL MODULO
router.use(authMiddleware);

// RUTAS
// ESCRITURA: SOLO PROFESIONALES (VET/ADMIN)
router.post('/', checkRole(['veterinario', 'admin']), historialController.createHistorial);

// LECTURA: ACCESIBLE A TODOS (EL CONTROLADOR FILTRARA PROPIEDAD LUEGO)
router.get('/:id', checkRole(['cliente', 'veterinario', 'admin']), historialController.getHistorialByMascota);

// MODIFICACION Y ELIMINACION
router.delete('/:id', checkRole(['veterinario', 'admin']), historialController.deleteHistorial);
router.put('/:id', checkRole(['veterinario', 'admin']), historialController.updateHistorial);

export default router;