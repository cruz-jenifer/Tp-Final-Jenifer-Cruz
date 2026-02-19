import * as MascotaModel from '../models/mascota.model';
import { Mascota, MascotaCrearDto } from '../models/mascota.model';
import * as DuenoModel from '../models/dueno.model';
import { RolNombre } from '../types/enums';

export class MascotaService {

    // LISTAR MASCOTAS PROPIAS
    static async listarPropias(usuarioId: number): Promise<Mascota[]> {
        const dueno = await DuenoModel.findByUserId(usuarioId);
        if (!dueno || !dueno.id) return [];
        return await MascotaModel.buscarPorDuenoId(dueno.id);
    }

    // OBTENER TODAS
    static async obtenerTodas(): Promise<Mascota[]> {
        return await MascotaModel.buscarTodos();
    }

    // REGISTRAR MASCOTA
    static async registrarMascota(usuarioId: number, datos: Partial<MascotaCrearDto> & { dueno_id?: number }, rol: string): Promise<Mascota> {
        let duenoId = datos.dueno_id;

        if (rol !== RolNombre.ADMIN) {
            const dueno = await DuenoModel.findByUserId(usuarioId);
            if (!dueno || !dueno.id) {
                throw new Error('DEBE COMPLETAR SU PERFIL DE DUEÑO ANTES DE REGISTRAR MASCOTAS');
            }
            duenoId = dueno.id;
        } else if (!duenoId) {
            throw new Error('DEBE ESPECIFICAR EL ID DEL DUEÑO PARA EL REGISTRO');
        }

        // VALIDAR FECHA
        const fechaNac = new Date(datos.fecha_nacimiento!);
        if (fechaNac > new Date()) {
            throw new Error('LA FECHA DE NACIMIENTO NO PUEDE SER FUTURA');
        }

        const mascotaDto: MascotaCrearDto = {
            nombre: datos.nombre!,
            raza_id: Number(datos.raza_id),
            fecha_nacimiento: datos.fecha_nacimiento!,
            dueno_id: duenoId
        };

        const mascotaId = await MascotaModel.crear(mascotaDto);
        const nueva = await MascotaModel.buscarPorId(mascotaId);
        if (!nueva) throw new Error('ERROR AL RECUPERAR LA MASCOTA CREADA');
        return nueva;
    }

    // ELIMINAR CON VALIDACION
    static async eliminarConValidacion(id: number, usuarioId: number, rol: string): Promise<void> {
        const mascota = await MascotaModel.buscarPorId(id);
        if (!mascota) throw new Error('MASCOTA NO ENCONTRADA');

        if (rol === RolNombre.CLIENTE) {
            const dueno = await DuenoModel.findByUserId(usuarioId);
            if (!dueno || mascota.dueno_id !== dueno.id) {
                throw new Error('ACCESO DENEGADO: NO TIENES PERMISO PARA ELIMINAR ESTA MASCOTA');
            }
        }

        await MascotaModel.eliminarPorId(id);
    }

    // ACTUALIZAR CON VALIDACIÓN
    static async actualizarMascota(id: number, usuarioId: number, datos: Partial<MascotaCrearDto> & { rol: string }): Promise<void> {
        const { rol, ...datosActualizar } = datos;
        const mascota = await MascotaModel.buscarPorId(id);
        if (!mascota) throw new Error('MASCOTA NO ENCONTRADA');

        // VALIDACION DE PERMISOS
        if (rol === RolNombre.CLIENTE) {
            const dueno = await DuenoModel.findByUserId(usuarioId);
            if (!dueno || mascota.dueno_id !== dueno.id) {
                throw new Error('ACCESO DENEGADO: NO TIENES PERMISO PARA EDITAR ESTA MASCOTA');
            }
        }

        await MascotaModel.actualizar(id, datosActualizar);
    }
}