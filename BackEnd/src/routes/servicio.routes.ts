import { Router } from 'express';
import { getServicios } from '../controllers/servicio.controller';

const router = Router();

// RUTAS PUBLICAS (CATALOGO DE PRECIOS)
router.get('/', getServicios);

export default router;