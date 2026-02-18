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
            // RECIBIR FECHA
            const fecha = req.query.fecha as string;
            const userId = req.user?.id;

            if (!userId) throw new Error('USUARIO NO IDENTIFICADO');

            // OBTENER AGENDA
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
            if (!userId) throw new Error('USUARIO NO IDENTIFICADO');

            // CREAR HISTORIAL
            const nuevoHistorial = await HistorialService.crearFicha(userId, req.body);

            res.status(201).json({
                message: 'HISTORIAL CREADO CON EXITO',
                data: nuevoHistorial
            });
        } catch (error: any) {
            // MANEJO DE ERRORES
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
            if (!userId) throw new Error('USUARIO NO IDENTIFICADO');

            const historiales = await HistorialService.obtenerRecientes(userId);
            res.json(historiales);
        } catch (error) {
            next(error);
        }
    }

    // CREAR VETERINARIO
    static async create(req: Request, res: Response, next: NextFunction) {
        try {
            const { nombre, apellido, email, matricula } = req.body;

            // IMPORTAR SERVICIO
            const { registrarVeterinario } = await import('../services/veterinarios.service');

            const nuevoVet = await registrarVeterinario({ nombre, apellido, email, matricula });

            res.status(201).json({
                message: 'VETERINARIO CREADO EXITOSAMENTE',
                data: nuevoVet
            });
        } catch (error: any) {
            if (error.message.includes('EMAIL')) {
                return res.status(409).json({ message: error.message });
            }
            next(error);
        }
    }

    // ACTUALIZAR VETERINARIO
    static async update(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);
            if (isNaN(id)) throw new Error('ID INVALIDO');

            const { actualizarVeterinario } = await import('../services/veterinarios.service');
            const vetActualizado = await actualizarVeterinario(id, req.body);

            res.json({
                message: 'VETERINARIO ACTUALIZADO EXITOSAMENTE',
                data: vetActualizado
            });
        } catch (error) {
            next(error);
        }
    }

    // ELIMINAR VETERINARIO
    static async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);
            if (isNaN(id)) throw new Error('ID INVALIDO');

            const { eliminarVeterinario } = await import('../services/veterinarios.service');
            await eliminarVeterinario(id);

            res.json({ message: 'VETERINARIO ELIMINADO EXITOSAMENTE' });
        } catch (error) {
            next(error);
        }
    }
}