import { Router } from 'express';
import { VeterinarioController } from '../controllers/veterinarios.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { checkRole } from '../middlewares/role.middleware';

const router = Router();

// SEGURIDAD GLOBAL DEL MODULO
router.use(authMiddleware);

// LISTAR VETERINARIOS
router.get('/', VeterinarioController.listarTodos);

// VER AGENDA
router.get('/agenda', checkRole(['veterinario', 'admin']), VeterinarioController.verAgenda);

// CREAR HISTORIAL
router.post('/historial', checkRole(['veterinario', 'admin']), VeterinarioController.crearHistorial);

// HISTORIAL RECIENTE
router.get('/historial-reciente', checkRole(['veterinario', 'admin']), VeterinarioController.obtenerHistorialReciente);

// CRUD VETERINARIOS (ADMIN)
router.post('/', checkRole(['admin']), VeterinarioController.crear);
router.put('/:id', checkRole(['admin']), VeterinarioController.actualizar);
router.delete('/:id', checkRole(['admin']), VeterinarioController.eliminar);

export default router;