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
        // FORMATEAR FECHA
        // El frontend envía 'YYYY-MM-DD HH:mm:ss' (Local). Lo guardamos tal cual.
        const fechaStr = datosTurno.fecha_hora as unknown as string;

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

    // AGENDA DIARIA GLOBAL (ADMIN)
    static async obtenerAgendaGlobal(fecha?: string) {
        const fechaBusqueda = fecha || new Date().toISOString().split('T')[0];
        const turnos = await TurnoModel.findAllByFecha(fechaBusqueda);
        return {
            fecha: fechaBusqueda,
            total_turnos: turnos.length,
            turnos: turnos
        };
    }

    // AGENDA DIARIA INDIVIDUAL (VETERINARIO)
    static async obtenerAgendaVeterinario(usuarioId: number, fecha?: string) {
        // 1. Obtener perfil de veterinario
        const { VeterinarioModel } = await import('../models/veterinarios.model'); // Importación dinámica para evitar ciclos
        const veterinario = await VeterinarioModel.findByUserId(usuarioId);

        if (!veterinario || !veterinario.id) {
            throw new Error('Perfil de veterinario no encontrado para este usuario');
        }

        // 2. Definir fecha
        const fechaBusqueda = fecha || new Date().toISOString().split('T')[0];

        // 3. Buscar turnos filtrados
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
            throw new Error('Turno no encontrado');
        }

        // VALIDAR ESTADO
        if (turno.estado !== 'pendiente') {
            throw new Error('Solo se pueden cancelar turnos pendientes');
        }

        // ACTUALIZAR A CANCELADO
        await TurnoModel.updateStatus(turnoId, 'cancelado');

        return { message: 'Turno cancelado exitosamente' };
    }

    // ELIMINAR TURNO (FISICAMENTE)
    static async eliminarTurno(turnoId: number, usuarioId: number) {
        const turno = await TurnoModel.findById(turnoId);
        if (!turno) throw new Error('Turno no encontrado');

        // Solo permitir eliminar si ya está cancelado
        if (turno.estado !== 'cancelado') {
            throw new Error('Solo se pueden eliminar turnos cancelados');
        }

        await TurnoModel.delete(turnoId);
        return { message: 'Turno eliminado definitivamente' };
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
            const fechaStr = datos.fecha_hora instanceof Date
                ? datos.fecha_hora.toISOString().slice(0, 19).replace('T', ' ')
                : datos.fecha_hora;
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