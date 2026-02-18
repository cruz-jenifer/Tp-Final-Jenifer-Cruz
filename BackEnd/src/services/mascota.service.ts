import * as mascotaModel from '../models/mascota.model';
import * as duenoModel from '../models/dueno.model';
import { IMascota } from '../models/interfaces/mascota.interface';

// REGISTRAR MASCOTA
// REGISTRAR MASCOTA
export const registrarMascota = async (userId: number, datosMascota: any, userRole: string): Promise<IMascota> => {
    let duenoId = datosMascota.dueno_id;

    // VALIDAR ROL
    if (userRole !== 'admin') {
        const dueno = await duenoModel.findByUserId(userId);
        if (!dueno || !dueno.id) {
            throw new Error('DEBE COMPLETAR SU PERFIL DE DUENO ANTES DE REGISTRAR MASCOTAS');
        }
        duenoId = dueno.id;
    } else {
        // VALIDAR DUENO
        if (!duenoId) {
            throw new Error('DEBE ESPECIFICAR EL ID DEL DUENO');
        }
    }

    // INSERTAR MASCOTA
    return await mascotaModel.create({
        ...datosMascota,
        dueno_id: duenoId
    });
};

// OBTENER MASCOTAS PROPIAS
export const misMascotas = async (userId: number): Promise<IMascota[]> => {
    // BUSCAR DUENO
    const dueno = await duenoModel.findByUserId(userId);

    // SIN PERFIL
    if (!dueno || !dueno.id) {
        return [];
    }

    // FILTRAR POR DUENO
    return await mascotaModel.findByDuenoId(dueno.id);
};

// OBTENER MASCOTA POR ID
export const obtenerMascota = async (id: number): Promise<IMascota | null> => {
    return await mascotaModel.findById(id);
};

// OBTENER TODAS LAS MASCOTAS
export const obtenerTodas = async (): Promise<any[]> => {
    return await mascotaModel.findAll();
};

// ELIMINAR MASCOTA
export const eliminarMascota = async (mascotaId: number, userId: number, userRole: string): Promise<void> => {
    const mascota = await mascotaModel.findById(mascotaId);
    if (!mascota) throw new Error('MASCOTA NO ENCONTRADA');

    // ADMIN PUEDE BORRAR DIRECTO
    if (userRole === 'admin') {
        await mascotaModel.deleteById(mascotaId);
        return;
    }

    // VERIFICAR PERTENENCIA
    const dueno = await duenoModel.findByUserId(userId);
    if (!dueno || dueno.id !== mascota.dueno_id) {
        throw new Error('NO TIENE PERMISO PARA ELIMINAR ESTA MASCOTA');
    }

    await mascotaModel.deleteById(mascotaId);
};

// ACTUALIZAR MASCOTA
export const actualizarMascota = async (mascotaId: number, userId: number, datos: Partial<IMascota>): Promise<void> => {
    const mascota = await mascotaModel.findById(mascotaId);
    if (!mascota) throw new Error('MASCOTA NO ENCONTRADA');

    const dueno = await duenoModel.findByUserId(userId);

    // VERIFICAR PERTENENCIA
    if (datos.rol !== 'admin') {
        if (!dueno || dueno.id !== mascota.dueno_id) {
            throw new Error('NO TIENE PERMISO PARA EDITAR ESTA MASCOTA');
        }
    }

    await mascotaModel.update(mascotaId, datos);
};