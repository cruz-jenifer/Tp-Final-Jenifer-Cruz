import { Router } from 'express';
import { VeterinarioController } from '../controllers/veterinarios.controller';
import { autenticar, autorizar } from '../middlewares/auth.middleware';
import { validateVeterinario, validateVeterinarioUpdate } from '../validators/veterinario.validator';

const router = Router();

// SEGURIDAD GLOBAL DEL MODULO
router.use(autenticar);

// LISTAR VETERINARIOS
router.get('/', VeterinarioController.listarTodos);

// VER AGENDA
router.get('/agenda', autorizar(['veterinario', 'admin']), VeterinarioController.verAgenda);

// CREAR HISTORIAL
router.post('/historial', autorizar(['veterinario', 'admin']), VeterinarioController.crearHistorial);

// HISTORIAL RECIENTE
router.get('/historial-reciente', autorizar(['veterinario', 'admin']), VeterinarioController.obtenerHistorialReciente);

// CREAR VETERINARIO
router.post('/', autorizar(['admin']), validateVeterinario, VeterinarioController.crear);

// ACTUALIZAR VETERINARIO
router.put('/:id', autorizar(['admin']), validateVeterinarioUpdate, VeterinarioController.actualizar);

// ELIMINAR VETERINARIO
router.delete('/:id', autorizar(['admin']), VeterinarioController.eliminar);

export default router;