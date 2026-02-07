import { Router } from 'express';
import { getMascotas } from '../controllers/mascotas.controller';

const router = Router();

router.get('/', getMascotas);

export default router;