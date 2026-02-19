import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

// MIDDLEWARE PARA PROCESAR RESULTADOS
const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
};

// VALIDACIONES PARA CREAR/ACTUALIZAR MASCOTA
export const validateMascota = [
    body('nombre')
        .trim()
        .notEmpty().withMessage('EL NOMBRE ES OBLIGATORIO')
        .isLength({ max: 50 }).withMessage('MÁXIMO 50 CARACTERES'),

    body('raza_id')
        .notEmpty().withMessage('LA RAZA ES OBLIGATORIA')
        .isInt({ min: 1 }).withMessage('ID DE RAZA INVÁLIDO'),

    body('fecha_nacimiento')
        .notEmpty().withMessage('LA FECHA DE NACIMIENTO ES OBLIGATORIA')
        .isISO8601().withMessage('FORMATO DE FECHA INVÁLIDO (YYYY-MM-DD)'),

    handleValidationErrors
];
