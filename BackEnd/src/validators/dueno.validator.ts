import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

// MIDDLEWARE PARA PROCESAR ERRORES DE VALIDACION
const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
};

// VALIDACION DE PERFIL DE DUENO
export const validatePerfil = [
    body('telefono')
        .trim()
        .notEmpty().withMessage('EL TELEFONO ES OBLIGATORIO')
        .isLength({ max: 20 }).withMessage('EL TELEFONO NO PUEDE SUPERAR LOS 20 CARACTERES'),

    body('dni')
        .optional()
        .trim()
        .isLength({ max: 15 }).withMessage('EL DNI NO PUEDE SUPERAR LOS 15 CARACTERES'),

    handleValidationErrors
];

// VALIDACION DE CREACION DE DUENO POR ADMIN
export const validateDuenoAdmin = [
    body('nombre')
        .trim()
        .notEmpty().withMessage('EL NOMBRE ES OBLIGATORIO')
        .isLength({ max: 50 }).withMessage('EL NOMBRE NO PUEDE SUPERAR LOS 50 CARACTERES'),

    body('apellido')
        .trim()
        .notEmpty().withMessage('EL APELLIDO ES OBLIGATORIO')
        .isLength({ max: 50 }).withMessage('EL APELLIDO NO PUEDE SUPERAR LOS 50 CARACTERES'),

    body('email')
        .isEmail().withMessage('DEBE SER UN EMAIL VALIDO')
        .normalizeEmail(),

    body('telefono')
        .trim()
        .notEmpty().withMessage('EL TELEFONO ES OBLIGATORIO')
        .isLength({ max: 20 }).withMessage('EL TELEFONO NO PUEDE SUPERAR LOS 20 CARACTERES'),

    body('dni')
        .optional()
        .trim()
        .isLength({ max: 15 }).withMessage('EL DNI NO PUEDE SUPERAR LOS 15 CARACTERES'),

    handleValidationErrors
];
