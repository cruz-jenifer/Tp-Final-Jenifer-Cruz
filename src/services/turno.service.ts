import { TurnoModel, ITurno } from '../models/turno.model';
import * as DuenoModel from '../models/dueno.model'; 

export class TurnoService {

    // RESERVAR TURNO CON VALIDACIONES
    static async reservarTurno(usuarioId: number, datosTurno: ITurno) {
        // OBTENER PERFIL DE DUENO
<<<<<<< HEAD
       
=======
>>>>>>> 0b51d21 (Feat 8: Panel Profesional (Roles)Objetivo: Endpoints exclusivos para empleados.)
        const dueno = await DuenoModel.findByUserId(usuarioId); 
        
        // MANEJO DE RETORNO DE DUENO 
        const duenoData = Array.isArray(dueno) ? dueno[0] : dueno;

        if (!duenoData || !duenoData.id) {
            throw new Error('El usuario no tiene un perfil de dueño registrado');
        }

        // FORMATEAR FECHA PARA MYSQL
        const fechaStr = new Date(datosTurno.fecha_hora).toISOString().slice(0, 19).replace('T', ' ');

        // VERIFICAR DISPONIBILIDAD
        const estaDisponible = await TurnoModel.validarDisponibilidad(
            datosTurno.veterinario_id,
            fechaStr
        );

        if (!estaDisponible) {
            throw new Error('El horario seleccionado ya se encuentra ocupado');
        }

        // PREPARAR DATOS
        const nuevoTurno: ITurno = {
            ...datosTurno,
            fecha_hora: fechaStr,
            estado: 'pendiente'
        };

        // GUARDAR
        const id = await TurnoModel.create(nuevoTurno);
        return { id, ...nuevoTurno };
    }

    // LISTAR TURNOS DEL USUARIO
    static async obtenerMisTurnos(usuarioId: number) {
        const dueno = await DuenoModel.findByUserId(usuarioId);
        const duenoData = Array.isArray(dueno) ? dueno[0] : dueno;

        if (!duenoData || !duenoData.id) {
            throw new Error('Perfil de dueño no encontrado');
        }

        return await TurnoModel.findAllByDuenoId(duenoData.id);
    }
<<<<<<< HEAD
=======

    //  VER AGENDA DEL DIA
    static async obtenerAgendaGlobal(fecha?: string) {
        
        // SI NO HAY FECHA, USAR LA DE HOY
       
        const fechaBusqueda = fecha || new Date().toISOString().split('T')[0];

        // LLAMAR AL MODELO
        const turnos = await TurnoModel.findAllByFecha(fechaBusqueda);
        
        return {
            fecha: fechaBusqueda,
            total_turnos: turnos.length,
            turnos: turnos
        };
    }
>>>>>>> 0b51d21 (Feat 8: Panel Profesional (Roles)Objetivo: Endpoints exclusivos para empleados.)
}