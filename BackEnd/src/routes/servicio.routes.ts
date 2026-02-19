import { Router } from 'express';
import { obtenerServicios } from '../controllers/servicio.controller';

const router = Router();

// RUTAS PUBLICAS (CATALOGO DE SERVICIOS)
router.get('/', obtenerServicios);

export default router;