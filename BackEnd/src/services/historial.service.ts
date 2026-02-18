import { HistorialModel, IHistorial } from '../models/historial.model';
import { VeterinarioModel } from '../models/veterinarios.model';
import * as MascotaModel from '../models/mascota.model';

export class HistorialService {

    // CREAR HISTORIAL
    static async crearFicha(usuarioId: number, datos: IHistorial) {

        // VALIDAR VETERINARIO
        const veterinario = await VeterinarioModel.findByUserId(usuarioId);

        if (!veterinario) {
            throw new Error('ACCESO DENEGADO');
        }

        // VALIDAR MASCOTA
        const mascota = await MascotaModel.findById(datos.mascota_id);

        // VERIFICAR EXISTENCIA
        const existeMascota = Array.isArray(mascota) ? mascota[0] : mascota;

        if (!existeMascota) {
            throw new Error('MASCOTA NO ENCONTRADA');
        }

        // PREPARAR DATOS
        const nuevaFicha: IHistorial = {
            ...datos,
            veterinario_id: veterinario.id!
        };

        // GUARDAR
        const id = await HistorialModel.create(nuevaFicha);
        return { id, ...nuevaFicha };
    }

    // VER HISTORIAL POR MASCOTA
    static async verHistorial(mascotaId: number) {

        return await HistorialModel.findByMascotaId(mascotaId);
    }

    // OBTENER HISTORIALES RECIENTES DEL VETERINARIO
    static async obtenerRecientes(usuarioId: number) {
        // BUSCAR VETERINARIO
        const veterinario = await VeterinarioModel.findByUserId(usuarioId);

        if (!veterinario) {
            throw new Error('ACCESO DENEGADO');
        }

        return await HistorialModel.findRecentByVeterinarioId(veterinario.id!);
    }

    // OBTENER TODOS LOS HISTORIALES
    static async obtenerTodos() {
        return await HistorialModel.findAll();
    }
}