import { Router } from 'express';
import authRoutes from './auth.routes';
import duenoRoutes from './dueno.routes';
import mascotaRoutes from './mascota.routes';
import turnoRoutes from './turno.routes';
import servicioRouter from './servicio.routes';
import historialRouter from './historial.routes';
import veterinarioRoutes from './veterinarios.routes';


const router = Router();

// RUTAS PRINCIPALES
router.use('/auth', authRoutes);
router.use('/duenos', duenoRoutes);
router.use('/mascotas', mascotaRoutes); // REGISTER MASCOTA ROUTES FOR GET BY ID
router.use('/turnos', turnoRoutes);
router.use('/servicios', servicioRouter);
router.use('/historial', historialRouter);
router.use('/veterinarios', veterinarioRoutes);


export default router;