import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import * as reservaController from '../controllers/reserva.controller';

const router = Router();

// Todas las rutas de reserva requieren autenticación
router.use(authMiddleware);

router.get('/', reservaController.getMisReservas);
router.post('/', reservaController.createReserva);
router.delete('/:id', reservaController.deleteReserva);

export default router;