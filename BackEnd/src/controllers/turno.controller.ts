import { Request, Response, NextFunction } from 'express';
import { TurnoService } from '../services/turno.service';

export class TurnoController {

    // METODO: LISTAR MIS TURNOS
    // DEBE LLAMARSE IGUAL QUE EN LAS RUTAS
    static async listarMisTurnos(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id;
            if (!userId) throw new Error('Usuario no identificado');

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
            const eliminarFisicamente = req.query.force === 'true'; // ?force=true para eliminar

            if (!userId) throw new Error('USUARIO NO IDENTIFICADO');
            if (isNaN(turnoId)) throw new Error('ID DE TURNO INVALIDO');

            if (eliminarFisicamente) {
                // Verificar si es dueño o admin (por ahora solo dueño del turno)
                // TODO: Verificar permisos mejor
                await TurnoService.eliminarTurno(turnoId, userId);
                return res.json({ message: 'TURNO ELIMINADO DEFINITIVAMENTE' });
            }

            const resultado = await TurnoService.cancelarTurno(turnoId, userId);
            res.json(resultado);
        } catch (error: any) {
            if (error.message.includes('No tienes permiso')) {
                return res.status(403).json({ message: error.message });
            }
            if (error.message.includes('pendiente')) {
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

    // OBTENER DETALLE
    static async getOne(req: Request, res: Response, next: NextFunction) {
        try {
            const turnoId = Number(req.params.id);
            if (isNaN(turnoId)) throw new Error('ID DE TURNO INVALIDO');

            const turno = await TurnoService.obtenerDetalle(turnoId);
            if (!turno) return res.status(404).json({ message: 'Turno no encontrado' });

            res.json({ data: turno });
        } catch (error) {
            next(error);
        }
    }

    // METODO: RESERVAR

    static async reservar(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id;
            if (!userId) throw new Error('Usuario no identificado');

            // DELEGAMOS AL SERVICIO
            const nuevoTurno = await TurnoService.reservarTurno(userId, req.body);

            res.status(201).json({
                message: 'TURNO RESERVADO CON ÉXITO',
                data: nuevoTurno
            });
        } catch (error: any) {
            // MANEJO DE ERRORES CONOCIDOS
            if (error.message.includes('ocupado')) {
                return res.status(409).json({ message: error.message });
            }
            if (error.message.includes('dueño')) {
                return res.status(403).json({ message: error.message });
            }
            next(error);
        }
    }
}