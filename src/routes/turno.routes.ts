import { Router } from 'express';
import { TurnoController } from '../controllers/turno.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { checkRole } from '../middlewares/role.middleware'; 

const router = Router();

// MIDDLEWARE GLOBAL
router.use(authMiddleware);

// LISTAR MIS TURNOS
router.get('/mis-turnos', checkRole(['cliente', 'admin']), TurnoController.listarMisTurnos);
// CREAR NUEVA RESERVA
router.post('/', checkRole(['cliente', 'admin']), TurnoController.reservar);


export default router;