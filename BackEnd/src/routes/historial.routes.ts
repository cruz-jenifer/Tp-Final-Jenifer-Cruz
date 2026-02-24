import { Router } from 'express';
import { autenticar, autorizar } from '../middlewares/auth.middleware';
import * as historialController from '../controllers/historial.controller';
import { validateHistorial, validateHistorialUpdate } from '../validators/historial.validator';

const router = Router();

// SEGURIDAD GLOBAL DEL MODULO
router.use(autenticar);

// CREAR REGISTRO
router.post('/', autorizar(['veterinario', 'admin']), validateHistorial, historialController.crearHistorial);

// LISTAR TODOS LOS HISTORIALES
router.get('/admin/all', autorizar(['admin']), historialController.obtenerTodosLosHistoriales);

// OBTENER HISTORIAL POR MASCOTA
router.get('/:id', autorizar(['cliente', 'veterinario', 'admin']), historialController.obtenerHistorialPorMascota);

// ELIMINAR REGISTRO
router.delete('/:id', autorizar(['veterinario', 'admin']), historialController.eliminarHistorial);

// ACTUALIZAR REGISTRO
router.put('/:id', autorizar(['veterinario', 'admin']), validateHistorialUpdate, historialController.actualizarHistorial);

export default router;