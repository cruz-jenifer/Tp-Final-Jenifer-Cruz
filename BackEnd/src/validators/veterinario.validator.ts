import { body, param, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

// MIDDLEWARE PARA PROCESAR ERRORES DE VALIDACION
const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
};

// VALIDACION PARA CREAR VETERINARIO
export const validateVeterinario = [
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

    body('matricula')
        .trim()
        .notEmpty().withMessage('LA MATRICULA ES OBLIGATORIA')
        .isLength({ max: 20 }).withMessage('LA MATRICULA NO PUEDE SUPERAR LOS 20 CARACTERES'),

    handleValidationErrors
];

// VALIDACION PARA ACTUALIZAR VETERINARIO
export const validateVeterinarioUpdate = [
    param('id')
        .isInt({ min: 1 }).withMessage('EL ID DEBE SER UN ENTERO POSITIVO'),

    body('matricula')
        .optional()
        .trim()
        .notEmpty().withMessage('LA MATRICULA NO PUEDE ESTAR VACIA')
        .isLength({ max: 20 }).withMessage('LA MATRICULA NO PUEDE SUPERAR LOS 20 CARACTERES'),

    handleValidationErrors
];
