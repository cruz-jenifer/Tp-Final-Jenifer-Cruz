import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import * as duenoController from '../controllers/dueno.controller';
import { checkRole } from '../middlewares/role.middleware';

const router = Router();

// MIDDLEWARE DE AUTENTICACION
router.use(authMiddleware);

// RUTAS DE PERFIL
router.post('/perfil', duenoController.crearPerfil);
router.get('/perfil', duenoController.obtenerMiPerfil);
router.put('/perfil', duenoController.actualizarPerfil);

// RUTAS ADMIN
router.get('/', checkRole(['admin']), duenoController.obtenerTodosLosDuenos);
router.post('/', checkRole(['admin']), duenoController.crearDuenoAdmin);
router.delete('/:id', checkRole(['admin']), duenoController.eliminarDueno);

export default router;