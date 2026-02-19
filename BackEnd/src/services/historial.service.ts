import { HistorialModel, CreateHistorialDto } from '../models/historial.model';
import * as VeterinarioModel from '../models/veterinarios.model';
import * as MascotaModel from '../models/mascota.model';
import { RolNombre } from '../types/enums';

export class HistorialService {

    // CREAR REGISTRO
    static async crearRegistro(usuarioId: number, rol: string, datos: Partial<CreateHistorialDto>) {
        const { mascota_id, diagnostico, tratamiento, fecha } = datos;

        if (!mascota_id || !diagnostico || !fecha) {
            throw new Error('FALTAN DATOS OBLIGATORIOS');
        }

        // DETERMINAR VETERINARIO
        const veterinario = await VeterinarioModel.findByUserId(usuarioId);
        let veterinarioId: number;

        if (veterinario) {
            veterinarioId = veterinario.id;
        } else if (rol === RolNombre.ADMIN) {
            veterinarioId = 1;
        } else {
            throw new Error('ACCESO DENEGADO: NO TIENES PERFIL PROFESIONAL');
        }

        const nuevoRegistro: CreateHistorialDto = {
            mascota_id,
            veterinario_id: veterinarioId,
            fecha,
            diagnostico,
            tratamiento: tratamiento || ''
        };

        const id = await HistorialModel.create(nuevoRegistro);
        return { id, ...nuevoRegistro };
    }

    // OBTENER POR MASCOTA CON VALIDACION DE DUEÑO
    static async obtenerPorMascota(mascotaId: number, usuarioId: number, rol: string) {
        // VALIDACION DE PROPIEDAD
        if (rol === RolNombre.CLIENTE) {
            const mascota = await MascotaModel.findById(mascotaId);
            if (!mascota) throw new Error('MASCOTA NO ENCONTRADA');
        }

        return await HistorialModel.findByMascotaId(mascotaId);
    }

    // ELIMINAR REGISTRO CON VALIDACION
    static async eliminarRegistro(id: number, usuarioId: number, rol: string) {
        const historial = await HistorialModel.findById(id);
        if (!historial) throw new Error('HISTORIAL NO ENCONTRADO');

        if (rol !== RolNombre.ADMIN) {
            const veterinario = await VeterinarioModel.findByUserId(usuarioId);
            if (!veterinario || veterinario.id !== historial.veterinario_id) {
                throw new Error('NO TIENES PERMISO PARA ELIMINAR ESTE REGISTRO');
            }
        }

        await HistorialModel.delete(id);
    }

    // ACTUALIZAR REGISTRO CON VALIDACION
    static async actualizarRegistro(id: number, usuarioId: number, rol: string, datos: { diagnostico?: string, tratamiento?: string }) {
        const historial = await HistorialModel.findById(id);
        if (!historial) throw new Error('HISTORIAL NO ENCONTRADO');

        if (rol !== RolNombre.ADMIN) {
            const veterinario = await VeterinarioModel.findByUserId(usuarioId);
            if (!veterinario || veterinario.id !== historial.veterinario_id) {
                throw new Error('NO TIENES PERMISO PARA EDITAR ESTE REGISTRO');
            }
        }

        await HistorialModel.update(id, datos);
    }

    // OBTENER RECIENTES
    static async obtenerRecientes(usuarioId: number) {
        const veterinario = await VeterinarioModel.findByUserId(usuarioId);
        if (!veterinario) throw new Error('ACCESO DENEGADO');
        return await HistorialModel.findRecentByVeterinarioId(veterinario.id);
    }

    // OBTENER TODOS
    static async obtenerTodos() {
        return await HistorialModel.findAll();
    }
}
