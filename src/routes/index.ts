import { Router } from 'express';
import authRoutes from './auth.routes';
import mascotasRoutes from './mascotas.routes';
import duenosRoutes from './duenos.routes';
import veterinariosRoutes from './veterinarios.routes';
import historialRoutes from './historial.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/mascotas', mascotasRoutes);
router.use('/duenos', duenosRoutes);
router.use('/veterinarios', veterinariosRoutes);
router.use('/historial', historialRoutes);

export default router;