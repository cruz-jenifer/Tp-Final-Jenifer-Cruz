import { Router } from 'express';
import { TurnoController } from '../controllers/turno.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { checkRole } from '../middlewares/role.middleware';
import { turnoValidators } from '../validators/turno.validators';

const router = Router();

// MIDDLEWARE GLOBAL
router.use(authMiddleware);

// LISTAR MIS TURNOS
router.get('/mis-turnos', checkRole(['cliente', 'admin']), TurnoController.listarMisTurnos);

// VER AGENDA GLOBAL
router.get('/agenda', checkRole(['admin']), TurnoController.verAgendaGlobal);

// VERIFICAR DISPONIBILIDAD
router.get('/check-availability', checkRole(['cliente', 'admin']), TurnoController.checkAvailability);

// CREAR NUEVA RESERVA
router.post('/',
    [checkRole(['cliente', 'admin']), ...turnoValidators.reservar],
    TurnoController.reservar
);

// CANCELAR RESERVA
router.delete('/:id',
    [checkRole(['cliente', 'admin']), ...turnoValidators.cancelar],
    TurnoController.cancelarTurno
);

// DETALLE Y REPROGRAMACION
router.get('/:id', checkRole(['cliente', 'admin']), TurnoController.getOne);
router.put('/:id',
    [checkRole(['cliente', 'admin']), ...turnoValidators.cancelar],
    TurnoController.reprogramar
);


export default router;