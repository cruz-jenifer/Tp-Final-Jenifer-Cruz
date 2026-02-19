import { Router } from 'express';
import { autenticar, autorizar } from '../middlewares/auth.middleware';
import * as historialController from '../controllers/historial.controller';

const router = Router();

// SEGURIDAD GLOBAL DEL MODULO
router.use(autenticar);

// CREAR REGISTRO
router.post('/', autorizar(['veterinario', 'admin']), historialController.crearHistorial);

// VER TODO EL HISTORIAL (ADMIN)
router.get('/admin/all', autorizar(['admin']), historialController.obtenerTodosLosHistoriales);

// VER HISTORIAL DE MASCOTA
router.get('/:id', autorizar(['cliente', 'veterinario', 'admin']), historialController.obtenerHistorialPorMascota);

// ELIMINAR Y ACTUALIZAR
router.delete('/:id', autorizar(['veterinario', 'admin']), historialController.eliminarHistorial);
router.put('/:id', autorizar(['veterinario', 'admin']), historialController.actualizarHistorial);

export default router;