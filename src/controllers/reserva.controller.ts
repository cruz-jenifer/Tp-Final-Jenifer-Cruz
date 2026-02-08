import { Request, Response, NextFunction } from 'express';
import * as reservaModel from '../models/reserva.model';

// Obtener mis reservas
export const getMisReservas = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) throw new Error('No autorizado'); // TypeScript safety
        
        const reservas = await reservaModel.findByUserId(req.user.id);
        res.json({ data: reservas });
    } catch (error) {
        next(error); // Pasa al error middleware (Feat 6)
    }
};

// Crear una reserva
export const createReserva = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) throw new Error('No autorizado');

        const { fecha, hora, motivo, mascota_id } = req.body;

        // Validación básica
        if (!fecha || !hora || !motivo) {
            return res.status(400).json({ message: 'Faltan campos obligatorios (fecha, hora, motivo)' });
        }

        const nuevaReserva = await reservaModel.create({
            fecha,
            hora,
            motivo,
            user_id: req.user.id, // ASIGNACIÓN AUTOMÁTICA (Feat 5)
            mascota_id
        });

        res.status(201).json({ message: 'Turno reservado con éxito', data: nuevaReserva });
    } catch (error) {
        next(error);
    }
};

// Eliminar mi reserva
export const deleteReserva = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) throw new Error('No autorizado');

        const { id } = req.params;
        const reservaId = Number(id);

        //  Verificar que la reserva exista
        const reserva = await reservaModel.findById(reservaId);
        if (!reserva) {
            return res.status(404).json({ message: 'Reserva no encontrada' });
        }

        //  Verificar que la reserva pertenezca al usuario (Feat 5: Seguridad)
        if (reserva.user_id !== req.user.id) {
            return res.status(403).json({ message: 'No tienes permiso para cancelar este turno' });
        }

        //  Eliminar
        await reservaModel.remove(reservaId);
        res.json({ message: 'Turno cancelado correctamente' });

    } catch (error) {
        next(error);
    }
};