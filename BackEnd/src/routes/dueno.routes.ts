import { Router } from 'express';
import { autenticar, autorizar } from '../middlewares/auth.middleware';
import * as duenoController from '../controllers/dueno.controller';

const router = Router();

// MIDDLEWARE DE AUTENTICACION
router.use(autenticar);

// RUTAS DE PERFIL
router.post('/perfil', duenoController.crearPerfil);
router.get('/perfil', duenoController.obtenerMiPerfil);
router.put('/perfil', duenoController.actualizarPerfil);

// RUTAS ADMIN
router.get('/', autorizar(['admin']), duenoController.obtenerTodosLosDuenos);
router.post('/', autorizar(['admin']), duenoController.crearDuenoAdmin);
router.delete('/:id', autorizar(['admin']), duenoController.eliminarDueno);

export default router;