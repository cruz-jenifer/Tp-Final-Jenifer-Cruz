import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import { checkRole } from '../middlewares/role.middleware';
import * as historialController from '../controllers/historial.controller';

const router = Router();

// SEGURIDAD GLOBAL DEL MODULO
router.use(authMiddleware);

// CREAR REGISTRO
router.post('/', checkRole(['veterinario', 'admin']), historialController.crearHistorial);

// VER TODO EL HISTORIAL (ADMIN)
router.get('/admin/all', checkRole(['admin']), historialController.obtenerTodosLosHistoriales);

// VER HISTORIAL DE MASCOTA
router.get('/:id', checkRole(['cliente', 'veterinario', 'admin']), historialController.obtenerHistorialPorMascota);

// ELIMINAR Y ACTUALIZAR
router.delete('/:id', checkRole(['veterinario', 'admin']), historialController.eliminarHistorial);
router.put('/:id', checkRole(['veterinario', 'admin']), historialController.actualizarHistorial);

export default router;