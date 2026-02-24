import { Router } from 'express';
import { autenticar, autorizar } from '../middlewares/auth.middleware';
import * as duenoController from '../controllers/dueno.controller';
import { validatePerfil, validateDuenoAdmin } from '../validators/dueno.validator';

const router = Router();

// SEGURIDAD GLOBAL DEL MODULO
router.use(autenticar);

// RUTAS DE PERFIL
router.post('/perfil', validatePerfil, duenoController.crearPerfil);
router.get('/perfil', duenoController.obtenerMiPerfil);
router.put('/perfil', validatePerfil, duenoController.actualizarPerfil);

// RUTAS ADMINISTRACION
router.get('/', autorizar(['admin']), duenoController.obtenerTodosLosDuenos);
router.post('/', autorizar(['admin']), validateDuenoAdmin, duenoController.crearDuenoAdmin);
router.delete('/:id', autorizar(['admin']), duenoController.eliminarDueno);

export default router;