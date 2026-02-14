import { TurnoModel, ITurno } from '../models/turno.model';
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

}