import { body, param, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

// MIDDLEWARE DE MANEJO DE ERRORES DE VALIDACION
const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
};

export const turnoValidators = {
    // VALIDACION PARA RESERVAR TURNO
    reservar: [
        body('mascota_id')
            .notEmpty().withMessage('EL ID DE LA MASCOTA ES OBLIGATORIO')
            .isInt({ min: 1 }).withMessage('EL ID DE LA MASCOTA DEBE SER UN ENTERO POSITIVO'),

        body('servicio_id')
            .notEmpty().withMessage('EL ID DEL SERVICIO ES OBLIGATORIO')
            .isInt({ min: 1 }).withMessage('EL ID DEL SERVICIO DEBE SER UN ENTERO POSITIVO'),

        body('veterinario_id')
            .notEmpty().withMessage('EL ID DEL VETERINARIO ES OBLIGATORIO')
            .isInt({ min: 1 }).withMessage('EL ID DEL VETERINARIO DEBE SER UN ENTERO POSITIVO'),

        body('fecha')
            .notEmpty().withMessage('LA FECHA ES OBLIGATORIA')
            .isISO8601().withMessage('FORMATO DE FECHA INVALIDO (YYYY-MM-DD)'),

        body('hora')
            .notEmpty().withMessage('LA HORA ES OBLIGATORIA')
            .matches(/^\d{2}:\d{2}(:\d{2})?$/).withMessage('FORMATO DE HORA INVALIDO (HH:MM)'),

        body('motivo_consulta')
            .notEmpty().withMessage('EL MOTIVO DE LA CONSULTA ES OBLIGATORIO')
            .isString().withMessage('EL MOTIVO DEBE SER TEXTO')
            .isLength({ min: 5, max: 255 }).withMessage('EL MOTIVO DEBE TENER ENTRE 5 Y 255 CARACTERES'),

        handleValidationErrors
    ],

    // VALIDACION PARA CANCELAR (ID PARAM)
    cancelar: [
        param('id')
            .notEmpty().withMessage('EL ID DEL TURNO ES OBLIGATORIO')
            .isInt({ min: 1 }).withMessage('EL ID DEL TURNO DEBE SER UN ENTERO POSITIVO'),

        handleValidationErrors
    ]
};
