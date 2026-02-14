import { Router } from 'express';
import { PagoController } from '../controllers/pago.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { checkRole } from '../middlewares/role.middleware';

const router = Router();

// MIDDLEWARE
router.use(authMiddleware);

// RUTAS
// PAGOS CLIENTE
router.post('/', checkRole(['cliente']), PagoController.registrarPago);
router.get('/mis-pagos', checkRole(['cliente']), PagoController.misPagos);

export default router;
