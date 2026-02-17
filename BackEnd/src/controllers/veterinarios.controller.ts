import { Request, Response, NextFunction } from 'express';
import { TurnoService } from '../services/turno.service';
import { HistorialService } from '../services/historial.service';
import { VeterinarioModel } from '../models/veterinarios.model';

export class VeterinarioController {

    // LISTAR TODOS LOS VETERINARIOS
    static async listarTodos(req: Request, res: Response, next: NextFunction) {
        try {
            const veterinarios = await VeterinarioModel.findAll();
            res.json(veterinarios);
        } catch (error) {
            next(error);
        }
    }

    // VER AGENDA GLOBAL DIARIA
    static async verAgenda(req: Request, res: Response, next: NextFunction) {
        try {
            // RECIBIMOS FECHA POR QUERY PARAM (?fecha=2023-10-27)
            const fecha = req.query.fecha as string;
            const userId = req.user?.id;

            if (!userId) throw new Error('Usuario no identificado');

            // LLAMAMOS AL SERVICIO DE TURNOS (LOGICA VETERINARIO)
            const agenda = await TurnoService.obtenerAgendaVeterinario(userId, fecha);

            res.json(agenda);
        } catch (error) {
            next(error);
        }
    }

    // CREAR HISTORIAL MEDICO
    static async crearHistorial(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id;
            if (!userId) throw new Error('Usuario no identificado');

            // DELEGAMOS AL SERVICIO DE HISTORIAL
            const nuevoHistorial = await HistorialService.crearFicha(userId, req.body);

            res.status(201).json({
                message: 'HISTORIAL CREADO CON EXITO',
                data: nuevoHistorial
            });
        } catch (error: any) {
            // MANEJO DE ERRORES DE NEGOCIO
            if (error.message.includes('ACCESO DENEGADO')) {
                return res.status(403).json({ message: error.message });
            }
            if (error.message.includes('no existe')) {
                return res.status(404).json({ message: error.message });
            }
            next(error);
        }
    }

    // OBTENER HISTORIAL RECIENTE
    static async obtenerHistorialReciente(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id;
            if (!userId) throw new Error('Usuario no identificado');

            const historiales = await HistorialService.obtenerRecientes(userId);
            res.json(historiales);
        } catch (error) {
            next(error);
        }
    }
}