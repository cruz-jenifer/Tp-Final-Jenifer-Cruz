import { TurnoModel, CreateTurnoDto } from '../models/turno.model';
import * as DuenoModel from '../models/dueno.model';
import * as VeterinarioModel from '../models/veterinarios.model';
import { EstadoTurno } from '../types/enums';

export class TurnoService {

    // RESERVAR TURNO
    static async reservarTurno(usuarioId: number, datosTurno: CreateTurnoDto & { dueno_id_override?: number }) {
        let duenoId: number;

        if (datosTurno.dueno_id_override) {
            duenoId = datosTurno.dueno_id_override;
        } else {
            // BUSCAR DUEÑO
            const dueno = await DuenoModel.findByUserId(usuarioId);

            if (!dueno || !dueno.id) {
                throw new Error('EL USUARIO NO TIENE PERFIL DE DUENO');
            }
            duenoId = dueno.id;
        }

        // VALIDAR FECHA NO PASADA
        const fechaTurno = new Date(`${datosTurno.fecha}T${datosTurno.hora}`);
        if (fechaTurno < new Date()) {
            throw new Error('NO SE PUEDEN AGENDAR TURNOS EN FECHAS PASADAS');
        }

        // VALIDAR DISPONIBILIDAD
        const estaDisponible = await TurnoModel.validarDisponibilidad(
            datosTurno.veterinario_id,
            datosTurno.fecha,
            datosTurno.hora
        );

        if (!estaDisponible) {
            throw new Error('EL VETERINARIO YA TIENE UN TURNO EN ESE HORARIO');
        }

        // DATOS TURNO
        const nuevoTurno: CreateTurnoDto = {
            mascota_id: datosTurno.mascota_id,
            veterinario_id: datosTurno.veterinario_id,
            servicio_id: datosTurno.servicio_id,
            fecha: datosTurno.fecha,
            hora: datosTurno.hora,
            motivo_consulta: datosTurno.motivo_consulta
        };

        // CREAR TURNO
        try {
            const id = await TurnoModel.create(nuevoTurno);
            return { id, ...nuevoTurno, estado: EstadoTurno.PENDIENTE };
        } catch (error: unknown) {
            // MANEJAR ERROR
            if (error && typeof error === 'object' && 'code' in error && error.code === 'ER_DUP_ENTRY') {
                throw new Error('EL VETERINARIO YA TIENE UN TURNO EN ESE HORARIO');
            }
            throw error;
        }
    }

    // LISTAR TURNOS
    static async obtenerMisTurnos(usuarioId: number) {
        const dueno = await DuenoModel.findByUserId(usuarioId);

        if (!dueno || !dueno.id) {
            throw new Error('PERFIL DE DUENO NO ENCONTRADO');
        }

        return await TurnoModel.findAllByDuenoId(dueno.id);
    }

    // AGENDA GLOBAL
    static async obtenerAgendaGlobal(fecha?: string) {
        if (!fecha) {
            const turnos = await TurnoModel.findAll();
            return {
                fecha: 'Todos',
                total_turnos: turnos.length,
                turnos: turnos
            };
        }

        const turnos = await TurnoModel.findAllByFecha(fecha);
        return {
            fecha: fecha,
            total_turnos: turnos.length,
            turnos: turnos
        };
    }

    // VERIFICAR DISPONIBILIDAD
    static async checkDisponibilidad(veterinarioId: number, fecha: string, hora: string): Promise<boolean> {
        return await TurnoModel.validarDisponibilidad(veterinarioId, fecha, hora);
    }

    // AGENDA VETERINARIO
    static async obtenerAgendaVeterinario(usuarioId: number, fecha?: string) {
        // BUSCAR PERFIL VETERINARIO
        const veterinario = await VeterinarioModel.findByUserId(usuarioId);

        if (!veterinario || !veterinario.id) {
            throw new Error('PERFIL DE VETERINARIO NO ENCONTRADO');
        }

        // DEFINIR FECHA
        const fechaBusqueda = fecha || new Date().toISOString().split('T')[0];

        // BUSCAR TURNOS
        const turnos = await TurnoModel.findAllByVeterinarioIdAndFecha(veterinario.id, fechaBusqueda);

        return {
            fecha: fechaBusqueda,
            veterinario_id: veterinario.id,
            total_turnos: turnos.length,
            turnos: turnos
        };
    }

    // CANCELAR TURNO
    static async cancelarTurno(turnoId: number, usuarioId: number) {

        // BUSCAR TURNO
        const turno = await TurnoModel.findById(turnoId);

        if (!turno) {
            throw new Error('TURNO NO ENCONTRADO');
        }

        // VALIDAR ESTADO
        if (turno.estado !== EstadoTurno.PENDIENTE) {
            throw new Error('SOLO SE PUEDEN CANCELAR TURNOS PENDIENTES');
        }

        // ACTUALIZAR A CANCELADO
        await TurnoModel.updateStatus(turnoId, EstadoTurno.CANCELADO);

        return { message: 'TURNO CANCELADO EXITOSAMENTE' };
    }

    // ELIMINAR TURNO
    static async eliminarTurno(turnoId: number, usuarioId: number) {
        const turno = await TurnoModel.findById(turnoId);
        if (!turno) throw new Error('TURNO NO ENCONTRADO');

        // VALIDAR ESTADO
        if (turno.estado !== EstadoTurno.CANCELADO) {
            throw new Error('SOLO SE PUEDEN ELIMINAR TURNOS CANCELADOS');
        }

        await TurnoModel.delete(turnoId);
        return { message: 'TURNO ELIMINADO DEFINITIVAMENTE' };
    }

    // REPROGRAMAR TURNO
    static async reprogramarTurno(turnoId: number, usuarioId: number, datos: Partial<CreateTurnoDto>) {
        const turno = await TurnoModel.findById(turnoId);
        if (!turno) throw new Error('TURNO NO ENCONTRADO');

        if (turno.estado !== EstadoTurno.PENDIENTE) {
            throw new Error('SOLO SE PUEDEN REPROGRAMAR TURNOS PENDIENTES');
        }

        // VALIDAR DISPONIBILIDAD
        const fecha = datos.fecha || turno.fecha;
        const hora = datos.hora || turno.hora;
        const vetId = datos.veterinario_id || turno.veterinario_id;

        const disponible = await TurnoModel.validarDisponibilidad(vetId, fecha, hora);
        if (!disponible) throw new Error('EL NUEVO HORARIO NO ESTA DISPONIBLE');

        await TurnoModel.update(turnoId, datos);
        return { message: 'TURNO REPROGRAMADO EXITOSAMENTE' };
    }

    // OBTENER DETALLE
    static async obtenerDetalle(id: number) {
        return await TurnoModel.findByIdDetalle(id);
    }
}
