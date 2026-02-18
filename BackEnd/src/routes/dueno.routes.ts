import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import * as duenoController from '../controllers/dueno.controller';

const router = Router();

// MIDDLEWARE DE AUTENTICACION
router.use(authMiddleware);

// RUTAS DE PERFIL
router.post('/perfil', duenoController.createPerfil);
router.get('/perfil', duenoController.getMiPerfil);
router.put('/perfil', duenoController.updatePerfil);

// RUTAS ADMIN
import { checkRole } from '../middlewares/role.middleware';
router.get('/', checkRole(['admin']), duenoController.getAllDuenos);
router.post('/', checkRole(['admin']), duenoController.createDuenoAdmin);
router.delete('/:id', checkRole(['admin']), duenoController.deleteDueno);

export default router;