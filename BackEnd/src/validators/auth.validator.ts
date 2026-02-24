import { Request, Response, NextFunction } from 'express';
import { check, validationResult } from 'express-validator';

// MIDDLEWARE PARA PROCESAR ERRORES DE VALIDACION
const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};

// VALIDACION DE REGISTRO
export const validateRegister = [
  check('nombre')
    .trim()
    .notEmpty().withMessage('EL NOMBRE ES OBLIGATORIO')
    .isLength({ max: 50 }).withMessage('EL NOMBRE NO PUEDE SUPERAR LOS 50 CARACTERES'),

  check('apellido')
    .trim()
    .notEmpty().withMessage('EL APELLIDO ES OBLIGATORIO')
    .isLength({ max: 50 }).withMessage('EL APELLIDO NO PUEDE SUPERAR LOS 50 CARACTERES'),

  check('email')
    .isEmail().withMessage('DEBE SER UN EMAIL VALIDO')
    .normalizeEmail(),

  check('password')
    .isLength({ min: 6 }).withMessage('LA CONTRASENA DEBE TENER AL MENOS 6 CARACTERES'),

  handleValidationErrors
];

// VALIDACION DE LOGIN
export const validateLogin = [
  check('email')
    .isEmail().withMessage('DEBE SER UN EMAIL VALIDO'),

  check('password')
    .exists().withMessage('LA CONTRASENA ES REQUERIDA'),

  handleValidationErrors
];