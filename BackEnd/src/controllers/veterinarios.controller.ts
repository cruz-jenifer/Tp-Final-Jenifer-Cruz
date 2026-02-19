import { Request, Response, NextFunction } from 'express';
import { TurnoService } from '../services/turno.service';
import { HistorialService } from '../services/historial.service';
import * as VeterinarioModel from '../models/veterinarios.model';
import * as veterinarioService from '../services/veterinarios.service';

export class VeterinarioController {

    // LISTAR TODOS LOS VETERINARIOS
    static async listarTodos(req: Request, res: Response, next: NextFunction) {
        try {
            const veterinarios = await VeterinarioModel.findAll();
            res.json({ success: true, mensaje: 'VETERINARIOS OBTENIDOS', data: veterinarios });
        } catch (error) {
            next(error);
        }
    }

    // VER AGENDA GLOBAL DIARIA
    static async verAgenda(req: Request, res: Response, next: NextFunction) {
        try {
            const fecha = req.query.fecha as string;
            const userId = req.user?.id;

            if (!userId) throw new Error('USUARIO NO IDENTIFICADO');

            const agenda = await TurnoService.obtenerAgendaVeterinario(userId, fecha);

            res.json({ success: true, mensaje: 'AGENDA OBTENIDA', data: agenda });
        } catch (error) {
            next(error);
        }
    }

    // CREAR HISTORIAL MEDICO
    static async crearHistorial(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id;
            const rol = req.user?.rol;
            if (!userId || !rol) throw new Error('USUARIO NO IDENTIFICADO');

            const nuevoHistorial = await HistorialService.crearRegistro(userId, rol, req.body);

            res.status(201).json({
                success: true,
                mensaje: 'HISTORIAL CREADO CON EXITO',
                data: nuevoHistorial
            });
        } catch (error: unknown) {
            if (error instanceof Error) {
                if (error.message.includes('ACCESO DENEGADO')) {
                    return res.status(403).json({ success: false, mensaje: error.message });
                }
                if (error.message.includes('no existe') || error.message.includes('NO ENCONTRADA')) {
                    return res.status(404).json({ success: false, mensaje: error.message });
                }
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
            res.json({ success: true, mensaje: 'HISTORIAL OBTENIDO', data: historiales });
        } catch (error: unknown) {
            next(error);
        }
    }

    // CREAR VETERINARIO (ADMIN)
    static async crear(req: Request, res: Response, next: NextFunction) {
        try {
            const { nombre, apellido, email, matricula } = req.body;

            const nuevoVet = await veterinarioService.registrarVeterinario({ nombre, apellido, email, matricula });

            res.status(201).json({
                success: true,
                mensaje: 'VETERINARIO CREADO EXITOSAMENTE',
                data: nuevoVet
            });
        } catch (error: unknown) {
            if (error instanceof Error) {
                if (error.message.includes('EMAIL')) {
                    return res.status(409).json({ success: false, mensaje: error.message });
                }
            }
            next(error);
        }
    }

    // ACTUALIZAR VETERINARIO (ADMIN)
    static async actualizar(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);
            if (isNaN(id)) throw new Error('ID INVALIDO');

            const vetActualizado = await veterinarioService.actualizarVeterinario(id, req.body);

            res.json({
                success: true,
                mensaje: 'VETERINARIO ACTUALIZADO EXITOSAMENTE',
                data: vetActualizado
            });
        } catch (error) {
            next(error);
        }
    }

    // ELIMINAR VETERINARIO (ADMIN)
    static async eliminar(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);
            if (isNaN(id)) throw new Error('ID INVALIDO');

            await veterinarioService.eliminarVeterinario(id);

            res.json({ success: true, mensaje: 'VETERINARIO ELIMINADO EXITOSAMENTE', data: null });
        } catch (error) {
            next(error);
        }
    }
}