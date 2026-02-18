import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import { checkRole } from '../middlewares/role.middleware';
import * as historialController from '../controllers/historial.controller';

const router = Router();

// APLICAR SEGURIDAD A TODO EL MODULO
router.use(authMiddleware);

// CREAR HISTORIAL
router.post('/', checkRole(['veterinario', 'admin']), historialController.createHistorial);

// VER TODOS
router.get('/admin/all', checkRole(['admin']), historialController.getAllHistorial);

// LEER HISTORIAL
router.get('/:id', checkRole(['cliente', 'veterinario', 'admin']), historialController.getHistorialByMascota);

// MODIFICAR Y ELIMINAR
router.delete('/:id', checkRole(['veterinario', 'admin']), historialController.deleteHistorial);
router.put('/:id', checkRole(['veterinario', 'admin']), historialController.updateHistorial);

export default router;