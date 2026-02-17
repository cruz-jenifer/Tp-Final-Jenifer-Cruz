import { HistorialModel, IHistorial } from '../models/historial.model';
import { VeterinarioModel } from '../models/veterinarios.model';
import * as MascotaModel from '../models/mascota.model';

export class HistorialService {

    // REGISTRAR NUEVA FICHA MEDICA
    static async crearFicha(usuarioId: number, datos: IHistorial) {

        //  VALIDAR IDENTIDAD DEL VETERINARIO
        // El token nos da el ID de usuario, buscamos su perfil profesional
        const veterinario = await VeterinarioModel.findByUserId(usuarioId);

        if (!veterinario) {
            throw new Error('ACCESO DENEGADO: El usuario no tiene perfil de veterinario.');
        }

        //  VALIDAR EXISTENCIA DE LA MASCOTA
        // Usamos MascotaModel como objeto de funciones
        const mascota = await MascotaModel.findById(datos.mascota_id);

        // Verificación defensiva (por si devuelve array o null)
        const existeMascota = Array.isArray(mascota) ? mascota[0] : mascota;

        if (!existeMascota) {
            throw new Error('La mascota indicada no existe en el sistema.');
        }

        //  PREPARAR DATOS (Vinculamos al veterinario que agenda)
        const nuevaFicha: IHistorial = {
            ...datos,
            veterinario_id: veterinario.id!
        };

        //  GUARDAR EN BASE DE DATOS
        const id = await HistorialModel.create(nuevaFicha);
        return { id, ...nuevaFicha };
    }

    // VER HISTORIAL DE UN PACIENTE
    static async verHistorial(mascotaId: number) {

        return await HistorialModel.findByMascotaId(mascotaId);
    }

    // OBTENER HISTORIALES RECIENTES DEL VETERINARIO
    static async obtenerRecientes(usuarioId: number) {
        // Buscar perfil veterinario
        const veterinario = await VeterinarioModel.findByUserId(usuarioId);

        if (!veterinario) {
            throw new Error('ACCESO DENEGADO: El usuario no tiene perfil de veterinario.');
        }

        return await HistorialModel.findRecentByVeterinarioId(veterinario.id!);
    }
}