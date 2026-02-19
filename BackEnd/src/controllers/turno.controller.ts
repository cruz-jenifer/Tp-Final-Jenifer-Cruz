import { Request, Response, NextFunction } from 'express';
import { TurnoService } from '../services/turno.service';
import { EstadoTurno } from '../types/enums';

export class TurnoController {

    // LISTAR MIS TURNOS
    static async listarMisTurnos(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id;
            if (!userId) throw new Error('USUARIO NO IDENTIFICADO');

            const turnos = await TurnoService.obtenerMisTurnos(userId);

            res.json({ success: true, mensaje: 'TURNOS OBTENIDOS', data: turnos });
        } catch (error: unknown) {
            next(error);
        }
    }

    // CANCELAR O ELIMINAR
    static async cancelarTurno(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id;
            const turnoId = Number(req.params.id);
            const eliminarFisicamente = req.query.force === 'true';

            if (!userId) throw new Error('USUARIO NO IDENTIFICADO');
            if (isNaN(turnoId)) throw new Error('ID DE TURNO INVALIDO');

            if (eliminarFisicamente) {
                await TurnoService.eliminarTurno(turnoId, userId);
                return res.json({ success: true, mensaje: 'TURNO ELIMINADO DEFINITIVAMENTE', data: null });
            }

            const resultado = await TurnoService.cancelarTurno(turnoId, userId);
            res.json({ success: true, mensaje: resultado.message, data: null });
        } catch (error: unknown) {
            if (error instanceof Error) {
                if (error.message.includes('PERMISO')) {
                    return res.status(403).json({ success: false, mensaje: error.message });
                }
                if (error.message.includes(EstadoTurno.PENDIENTE.toUpperCase()) || error.message.includes(EstadoTurno.CANCELADO.toUpperCase())) {
                    return res.status(409).json({ success: false, mensaje: error.message });
                }
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

            res.json({ success: true, mensaje: 'TURNO REPROGRAMADO EXITOSAMENTE', data: null });
        } catch (error: unknown) {
            next(error);
        }
    }

    // VER AGENDA GLOBAL
    static async verAgendaGlobal(req: Request, res: Response, next: NextFunction) {
        try {
            const fecha = req.query.fecha as string;
            const agenda = await TurnoService.obtenerAgendaGlobal(fecha);
            res.json({ success: true, mensaje: 'AGENDA OBTENIDA', data: agenda });
        } catch (error: unknown) {
            next(error);
        }
    }

    // VERIFICAR DISPONIBILIDAD
    static async verificarDisponibilidad(req: Request, res: Response, next: NextFunction) {
        try {
            const { veterinario_id, fecha, hora } = req.query;

            if (!veterinario_id || !fecha || !hora) {
                return res.status(400).json({ success: false, mensaje: 'FALTAN PARAMETROS OBLIGATORIOS' });
            }

            const hora_normalizada = (hora as string).length === 5 ? `${hora}:00` : (hora as string);

            const disponible = await TurnoService.checkDisponibilidad(
                Number(veterinario_id),
                fecha as string,
                hora_normalizada
            );

            res.json({ success: true, mensaje: 'DISPONIBILIDAD VERIFICADA', data: { disponible } });
        } catch (error: unknown) {
            next(error);
        }
    }

    // OBTENER DETALLE
    static async obtenerDetalle(req: Request, res: Response, next: NextFunction) {
        try {
            const turnoId = Number(req.params.id);
            if (isNaN(turnoId)) throw new Error('ID DE TURNO INVALIDO');

            const turno = await TurnoService.obtenerDetalle(turnoId);
            if (!turno) return res.status(404).json({ success: false, mensaje: 'TURNO NO ENCONTRADO' });

            res.json({ success: true, mensaje: 'TURNO OBTENIDO', data: turno });
        } catch (error: unknown) {
            next(error);
        }
    }

    // RESERVAR TURNO
    static async reservar(req: Request, res: Response, next: NextFunction) {
        try {
            const id_usuario = req.user?.id;
            if (!id_usuario) throw new Error('USUARIO NO IDENTIFICADO');

            // VALIDAR HORARIO
            if (req.body.hora) {
                const [hh, mm] = req.body.hora.split(':').map(Number);
                const horario_valido = hh >= 8 && hh < 17;
                const intervalo_valido = mm === 0 || mm === 30;

                if (!horario_valido || !intervalo_valido || (hh === 16 && mm > 30)) {
                    return res.status(400).json({
                        success: false,
                        mensaje: 'EL HORARIO SELECCIONADO NO ES VÁLIDO O ESTÁ FUERA DEL RANGO (08:00 - 17:00)'
                    });
                }
            }

            // PREPARAR DATOS
            const datos_turno = {
                fecha: req.body.fecha ?? null,
                hora: req.body.hora ? (req.body.hora.length === 5 ? `${req.body.hora}:00` : req.body.hora) : null,
                veterinario_id: req.body.veterinario_id ?? null,
                mascota_id: req.body.mascota_id ?? null,
                servicio_id: req.body.servicio_id ?? null,
                motivo_consulta: req.body.motivo_consulta ?? null,
                dueno_id_override: req.body.dueno_id ? Number(req.body.dueno_id) : undefined
            };

            const nuevo_turno = await TurnoService.reservarTurno(id_usuario, datos_turno);

            res.status(201).json({
                success: true,
                mensaje: 'TURNO RESERVADO CON EXITO',
                data: nuevo_turno
            });

        } catch (error: unknown) {
            if (error instanceof Error) {
                if (error.message.includes('HORARIO') || error.message.includes('OCUPADO') || (error as any).code === 'ER_DUP_ENTRY') {
                    return res.status(409).json({
                        success: false,
                        mensaje: 'EL VETERINARIO YA TIENE UN TURNO ASIGNADO EN ESE HORARIO'
                    });
                }
                if (error.message.includes('DUENO')) {
                    return res.status(403).json({ success: false, mensaje: error.message });
                }
                if (error.message.includes('PASADAS')) {
                    return res.status(400).json({ success: false, mensaje: error.message });
                }
            }
            next(error);
        }
    }
}
