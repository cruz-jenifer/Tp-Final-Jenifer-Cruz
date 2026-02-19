import { Router } from 'express';
import { TurnoController } from '../controllers/turno.controller';
import { autenticar, autorizar } from '../middlewares/auth.middleware';
import { turnoValidators } from '../validators/turno.validators';
import { RolNombre } from '../types/enums';

const router = Router();

// LISTAR TURNOS DEL USUARIO LOGUEADO
router.get('/mis-turnos', autenticar, autorizar([RolNombre.CLIENTE, RolNombre.ADMIN]), TurnoController.listarMisTurnos);

// VER AGENDA COMPLETA (SOLO ADMINISTRADORES)
router.get('/agenda', autenticar, autorizar([RolNombre.ADMIN]), TurnoController.verAgendaGlobal);

// VERIFICAR DISPONIBILIDAD DE HORARIOS
router.get('/check-availability', autenticar, TurnoController.verificarDisponibilidad);

// RESERVAR UN NUEVO TURNO
router.post('/', autenticar, turnoValidators.reservar, TurnoController.reservar);

// CANCELAR O ELIMINAR RESERVAS
router.delete('/:id', autenticar, turnoValidators.cancelar, TurnoController.cancelarTurno);

// OBTENER DETALLE DE UN TURNO
router.get('/:id', autenticar, TurnoController.obtenerDetalle);

// REPROGRAMAR TURNO EXISTENTE
router.put('/:id', autenticar, turnoValidators.cancelar, TurnoController.reprogramar);

export default router;