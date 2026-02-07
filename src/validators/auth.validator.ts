import { Request, Response, NextFunction } from 'express';
import { check, validationResult } from 'express-validator/check';

export const validateRegister = [
  check('email').isEmail().withMessage('Debe ser un email válido'),
  check('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

export const validateLogin = [
  check('email').isEmail().withMessage('Debe ser un email válido'),
  check('password').exists().withMessage('La contraseña es requerida'),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];