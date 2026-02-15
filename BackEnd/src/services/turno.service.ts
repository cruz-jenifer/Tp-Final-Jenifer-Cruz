import { TurnoModel, ITurno, ITurnoDetalle } from '../models/turno.model';
import * as DuenoModel from '../models/dueno.model';

export class TurnoService {

    // RESERVAR TURNO
    static async reservarTurno(usuarioId: number, datosTurno: ITurno) {
        // OBTENER DUENO
        const dueno = await DuenoModel.findByUserId(usuarioId);

        const duenoData = Array.isArray(dueno) ? dueno[0] : dueno;

        if (!duenoData || !duenoData.id) {
            throw new Error('El usuario no tiene un perfil de dueño registrado');
        }

        // FORMATEAR FECHA
        const fechaStr = new Date(datosTurno.fecha_hora).toISOString().slice(0, 19).replace('T', ' ');

        // VALIDAR DISPONIBILIDAD
        const estaDisponible = await TurnoModel.validarDisponibilidad(
            datosTurno.veterinario_id,
            fechaStr
        );

        if (!estaDisponible) {
            throw new Error('El horario seleccionado ya se encuentra ocupado');
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
            throw new Error('Perfil de dueño no encontrado');
        }

        return await TurnoModel.findAllByDuenoId(duenoData.id);
    }

    // AGENDA DIARIA
    static async obtenerAgendaGlobal(fecha?: string) {

        // FECHA ACTUAL
        const fechaBusqueda = fecha || new Date().toISOString().split('T')[0];

        // BUSCAR TURNOS
        const turnos = await TurnoModel.findAllByFecha(fechaBusqueda);

        return {
            fecha: fechaBusqueda,
            total_turnos: turnos.length,
            turnos: turnos
        };
    }

    // CANCELAR TURNO
    static async cancelarTurno(turnoId: number, usuarioId: number) {

        // BUSCAR TURNO
        const turno = await TurnoModel.findById(turnoId);

        if (!turno) {
            throw new Error('Turno no encontrado');
        }

        // VALIDAR PERMISO
        // NECESITAMOS SABER SI EL USUARIO ES EL DUENO DE LA MASCOTA DEL TURNO
        // SIMPLIFICACION: SI ES CLIENTE, VALIDAR RELACION. SI ES ADMIN/VET, PERMITIR.

        // VALIDAR ESTADO
        if (turno.estado !== 'pendiente') {
            throw new Error('Solo se pueden cancelar turnos pendientes');
        }

        // ACTUALIZAR A CANCELADO
        await TurnoModel.updateStatus(turnoId, 'cancelado');

        return { message: 'Turno cancelado exitosamente' };
    }

    // REPROGRAMAR TURNO
    static async reprogramarTurno(turnoId: number, usuarioId: number, datos: Partial<ITurno>) {
        const turno = await TurnoModel.findById(turnoId);
        if (!turno) throw new Error('Turno no encontrado');

        if (turno.estado !== 'pendiente') {
            throw new Error('Solo se pueden reprogramar turnos pendientes');
        }

        // VALIDAR NUEVA DISPONIBILIDAD SI CAMBIA FECHA
        if (datos.fecha_hora && datos.veterinario_id) {
            const fechaStr = new Date(datos.fecha_hora).toISOString().slice(0, 19).replace('T', ' ');
            const disponible = await TurnoModel.validarDisponibilidad(datos.veterinario_id, fechaStr);
            if (!disponible) throw new Error('El nuevo horario no está disponible');

            // Ajustar formato para SQL
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