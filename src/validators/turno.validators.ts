import { body, param, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

// MIDDLEWARE DE MANEJO DE ERRORES DE VALIDACION
const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

export const turnoValidators = {
    // VALIDACION PARA RESERVAR TURNO
    reservar: [
        body('mascota_id')
            .notEmpty().withMessage('El ID de la mascota es obligatorio')
            .isInt({ min: 1 }).withMessage('El ID de la mascota debe ser un entero positivo'),

        body('servicio_id')
            .notEmpty().withMessage('El ID del servicio es obligatorio')
            .isInt({ min: 1 }).withMessage('El ID del servicio debe ser un entero positivo'),

        body('veterinario_id')
            .notEmpty().withMessage('El ID del veterinario es obligatorio')
            .isInt({ min: 1 }).withMessage('El ID del veterinario debe ser un entero positivo'),

        body('fecha_hora')
            .notEmpty().withMessage('La fecha y hora son obligatorias')
            .isISO8601().withMessage('Formato de fecha inválido ')
            .custom((value: string) => {
                const fecha = new Date(value);
                const ahora = new Date();
                if (fecha <= ahora) {
                    throw new Error('La fecha del turno debe ser futura');
                }
                return true;
            }),

        body('motivo')
            .notEmpty().withMessage('El motivo de la consulta es obligatorio')
            .isString().withMessage('El motivo debe ser texto')
            .isLength({ min: 5, max: 255 }).withMessage('El motivo debe tener entre 5 y 255 caracteres'),

        handleValidationErrors
    ],

    // VALIDACION PARA CANCELAR (ID PARAM)
    cancelar: [
        param('id')
            .notEmpty().withMessage('El ID del turno es obligatorio')
            .isInt({ min: 1 }).withMessage('El ID del turno debe ser un entero positivo'),

        handleValidationErrors
    ]
};
