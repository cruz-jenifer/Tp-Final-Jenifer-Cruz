import { Request, Response, NextFunction } from 'express';
import { TurnoService } from '../services/turno.service';

export class TurnoController {

    // LISTAR MIS TURNOS
    static async listarMisTurnos(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id;
            if (!userId) throw new Error('USUARIO NO IDENTIFICADO');

            const turnos = await TurnoService.obtenerMisTurnos(userId);

            res.json({ data: turnos });
        } catch (error) {
            next(error);
        }
    }

    // CANCELAR O ELIMINAR TURNO
    static async cancelarTurno(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id;
            const turnoId = Number(req.params.id);
            const eliminarFisicamente = req.query.force === 'true';

            if (!userId) throw new Error('USUARIO NO IDENTIFICADO');
            if (isNaN(turnoId)) throw new Error('ID DE TURNO INVALIDO');

            if (eliminarFisicamente) {
                // ELIMINAR TURNO
                await TurnoService.eliminarTurno(turnoId, userId);
                return res.json({ message: 'TURNO ELIMINADO DEFINITIVAMENTE' });
            }

            const resultado = await TurnoService.cancelarTurno(turnoId, userId);
            res.json(resultado);
        } catch (error: any) {
            if (error.message.includes('PERMISO')) {
                return res.status(403).json({ message: error.message });
            }
            if (error.message.includes('PENDIENTE')) {
                return res.status(409).json({ message: error.message });
            }
            next(error);
        }
    }

    // REPROGRAMAR TURNO
    static async reprogramar(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id;
            const turnoId = Number(req.params.id);

            if (!userId) throw new Error('USUARIO NO IDENTIFICADO');
            if (isNaN(turnoId)) throw new Error('ID DE TURNO INVALIDO');

            await TurnoService.reprogramarTurno(turnoId, userId, req.body);

            res.json({ message: 'TURNO REPROGRAMADO EXITOSAMENTE' });
        } catch (error: any) {
            next(error);
        }
    }

    // VER AGENDA GLOBAL
    static async verAgendaGlobal(req: Request, res: Response, next: NextFunction) {
        try {
            const fecha = req.query.fecha as string;
            const agenda = await TurnoService.obtenerAgendaGlobal(fecha);
            res.json(agenda);
        } catch (error) {
            next(error);
        }
    }

    // VERIFICAR DISPONIBILIDAD
    static async checkAvailability(req: Request, res: Response, next: NextFunction) {
        try {
            const { veterinario_id, fecha, hora } = req.query;

            if (!veterinario_id || !fecha || !hora) {
                return res.status(400).json({ message: 'FALTAN PARAMETROS' });
            }

            const fechaHora = `${fecha} ${hora}:00`;
            const disponible = await TurnoService.checkDisponibilidad(Number(veterinario_id), fechaHora);

            res.json({ disponible });
        } catch (error) {
            next(error);
        }
    }

    // OBTENER TURNO
    static async getOne(req: Request, res: Response, next: NextFunction) {
        try {
            const turnoId = Number(req.params.id);
            if (isNaN(turnoId)) throw new Error('ID DE TURNO INVALIDO');

            const turno = await TurnoService.obtenerDetalle(turnoId);
            if (!turno) return res.status(404).json({ message: 'TURNO NO ENCONTRADO' });

            res.json({ data: turno });
        } catch (error) {
            next(error);
        }
    }

    // RESERVAR TURNO

    static async reservar(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id;
            if (!userId) throw new Error('USUARIO NO IDENTIFICADO');

            // RESERVAR
            const nuevoTurno = await TurnoService.reservarTurno(userId, { ...req.body, dueno_id_override: Number(req.body.dueno_id) });

            res.status(201).json({
                message: 'TURNO RESERVADO CON EXITO',
                data: nuevoTurno
            });
        } catch (error: any) {
            // MANEJO DE ERRORES
            if (error.message.includes('OCUPADO')) {
                return res.status(409).json({ message: error.message });
            }
            if (error.message.includes('DUENO')) {
                return res.status(403).json({ message: error.message });
            }
            next(error);
        }
    }
}