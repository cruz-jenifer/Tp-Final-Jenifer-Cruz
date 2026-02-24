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

// VALIDACION PARA CREAR HISTORIAL MEDICO
export const validateHistorial = [
    body('mascota_id')
        .notEmpty().withMessage('EL ID DE LA MASCOTA ES OBLIGATORIO')
        .isInt({ min: 1 }).withMessage('EL ID DE LA MASCOTA DEBE SER UN ENTERO POSITIVO'),

    body('diagnostico')
        .trim()
        .notEmpty().withMessage('EL DIAGNOSTICO ES OBLIGATORIO')
        .isString().withMessage('EL DIAGNOSTICO DEBE SER TEXTO'),

    body('tratamiento')
        .trim()
        .notEmpty().withMessage('EL TRATAMIENTO ES OBLIGATORIO')
        .isString().withMessage('EL TRATAMIENTO DEBE SER TEXTO'),

    handleValidationErrors
];

// VALIDACION PARA ACTUALIZAR HISTORIAL MEDICO
export const validateHistorialUpdate = [
    param('id')
        .isInt({ min: 1 }).withMessage('EL ID DEBE SER UN ENTERO POSITIVO'),

    body('diagnostico')
        .optional()
        .trim()
        .notEmpty().withMessage('EL DIAGNOSTICO NO PUEDE ESTAR VACIO')
        .isString().withMessage('EL DIAGNOSTICO DEBE SER TEXTO'),

    body('tratamiento')
        .optional()
        .trim()
        .notEmpty().withMessage('EL TRATAMIENTO NO PUEDE ESTAR VACIO')
        .isString().withMessage('EL TRATAMIENTO DEBE SER TEXTO'),

    handleValidationErrors
];
