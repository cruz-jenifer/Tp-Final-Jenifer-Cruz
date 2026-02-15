import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import * as authValidator from '../validators/auth.validator';

const router = Router();

router.post('/register', authValidator.validateRegister, authController.register);
router.post('/login', authValidator.validateLogin, authController.login);

export default router;