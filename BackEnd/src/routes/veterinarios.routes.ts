import { Router } from 'express';
import { VeterinarioController } from '../controllers/veterinarios.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { checkRole } from '../middlewares/role.middleware';

const router = Router();

// APLICAR SEGURIDAD A TODO EL MODULO
router.use(authMiddleware);

// RUTA: LISTAR TODOS LOS VETERINARIOS (PUBLICO PARA USUARIOS AUTENTICADOS)
router.get('/', VeterinarioController.listarTodos);

// RUTA: VER AGENDA GLOBAL DEL DIA
// SOLO VETERINARIOS Y ADMINS
router.get('/agenda', checkRole(['veterinario', 'admin']), VeterinarioController.verAgenda);

// RUTA: CREAR FICHA MEDICA
// SOLO VETERINARIOS (EL ADMIN TAMBIEN PUEDE POR SUPERVISION)
router.post('/historial', checkRole(['veterinario', 'admin']), VeterinarioController.crearHistorial);

// RUTA: OBTENER HISTORIAL RECIENTE
router.get('/historial-reciente', checkRole(['veterinario', 'admin']), VeterinarioController.obtenerHistorialReciente);

export default router;