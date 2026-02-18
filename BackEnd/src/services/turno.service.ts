import { TurnoModel, ITurno, ITurnoDetalle } from '../models/turno.model';
import * as DuenoModel from '../models/dueno.model';

export class TurnoService {

    // RESERVAR TURNO
    static async reservarTurno(usuarioId: number, datosTurno: ITurno & { dueno_id_override?: number }) {
        let duenoId: number;

        if (datosTurno.dueno_id_override) {
            duenoId = datosTurno.dueno_id_override;
        } else {
            // OBTENER DUENO
            const dueno = await DuenoModel.findByUserId(usuarioId);
            const duenoData = Array.isArray(dueno) ? dueno[0] : dueno;

            if (!duenoData || !duenoData.id) {
                throw new Error('EL USUARIO NO TIENE PERFIL DE DUENO');
            }
            duenoId = duenoData.id;
        }

        // FORMATEAR FECHA
        const fechaStr = datosTurno.fecha_hora as unknown as string;

        // VALIDAR DISPONIBILIDAD
        const estaDisponible = await TurnoModel.validarDisponibilidad(
            datosTurno.veterinario_id,
            fechaStr
        );

        if (!estaDisponible) {
            throw new Error('EL HORARIO SELECCIONADO YA SE ENCUENTRA OCUPADO');
        }

        // DATOS TURNO
        const nuevoTurno: ITurno = {
            ...datosTurno,
            fecha_hora: fechaStr,
            estado: 'pendiente'
        };

        // CREAR TURNO
        const id = await TurnoModel.create(nuevoTurno);
        return { id, ...nuevoTurno };
    }

    // LISTAR TURNOS
    static async obtenerMisTurnos(usuarioId: number) {
        const dueno = await DuenoModel.findByUserId(usuarioId);
        const duenoData = Array.isArray(dueno) ? dueno[0] : dueno;

        if (!duenoData || !duenoData.id) {
            throw new Error('PERFIL DE DUENO NO ENCONTRADO');
        }

        return await TurnoModel.findAllByDuenoId(duenoData.id);
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
    static async checkDisponibilidad(veterinarioId: number, fechaHora: string): Promise<boolean> {
        return await TurnoModel.validarDisponibilidad(veterinarioId, fechaHora);
    }

    // AGENDA VETERINARIO
    static async obtenerAgendaVeterinario(usuarioId: number, fecha?: string) {
        // BUSCAR PERFIL VETERINARIO
        const { VeterinarioModel } = await import('../models/veterinarios.model');
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
        if (turno.estado !== 'pendiente') {
            throw new Error('SOLO SE PUEDEN CANCELAR TURNOS PENDIENTES');
        }

        // ACTUALIZAR A CANCELADO
        await TurnoModel.updateStatus(turnoId, 'cancelado');

        return { message: 'Turno cancelado exitosamente' };
    }

    // ELIMINAR TURNO
    static async eliminarTurno(turnoId: number, usuarioId: number) {
        const turno = await TurnoModel.findById(turnoId);
        if (!turno) throw new Error('TURNO NO ENCONTRADO');

        // VALIDAR ESTADO
        if (turno.estado !== 'cancelado') {
            throw new Error('SOLO SE PUEDEN ELIMINAR TURNOS CANCELADOS');
        }

        await TurnoModel.delete(turnoId);
        return { message: 'Turno eliminado definitivamente' };
    }

    // REPROGRAMAR TURNO
    static async reprogramarTurno(turnoId: number, usuarioId: number, datos: Partial<ITurno>) {
        const turno = await TurnoModel.findById(turnoId);
        if (!turno) throw new Error('TURNO NO ENCONTRADO');

        if (turno.estado !== 'pendiente') {
            throw new Error('SOLO SE PUEDEN REPROGRAMAR TURNOS PENDIENTES');
        }

        // VALIDAR DISPONIBILIDAD
        if (datos.fecha_hora && datos.veterinario_id) {
            const fechaStr = datos.fecha_hora instanceof Date
                ? datos.fecha_hora.toISOString().slice(0, 19).replace('T', ' ')
                : datos.fecha_hora;
            const disponible = await TurnoModel.validarDisponibilidad(datos.veterinario_id, fechaStr);
            if (!disponible) throw new Error('EL NUEVO HORARIO NO ESTA DISPONIBLE');

            // FORMATEAR FECHA
            datos.fecha_hora = fechaStr;
        }

        await TurnoModel.update(turnoId, datos);
        return { message: 'Turno reprogramado exitosamente' };
    }

    // OBTENER DETALLE
    static async obtenerDetalle(id: number) {
        return await TurnoModel.findById(id);
    }
}