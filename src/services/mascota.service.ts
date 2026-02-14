import * as mascotaModel from '../models/mascota.model';
import * as duenoModel from '../models/dueno.model';
import { IMascota } from '../models/interfaces/mascota.interface';

// REGISTRAR MASCOTA (Requiere que el usuario tenga perfil de Dueño)
export const registrarMascota = async (userId: number, datosMascota: any): Promise<IMascota> => {
    // Buscar el perfil de Dueño asociado al usuario
    const dueno = await duenoModel.findByUserId(userId);

    // Validación de negocio: Usuario debe tener perfil de Dueño
    if (!dueno || !dueno.id) {
        throw new Error('Debe completar su perfil de dueño antes de registrar mascotas.');
    }

    // Insertar mascota forzando el dueno_id del usuario autenticado
    return await mascotaModel.create({
        ...datosMascota,
        dueno_id: dueno.id // Asignación automática y segura
    });
};

// OBTENER MASCOTAS PROPIAS (Scope por Dueño)
export const misMascotas = async (userId: number): Promise<IMascota[]> => {
    // Resolver el ID de dueño del usuario autenticado
    const dueno = await duenoModel.findByUserId(userId);

    // Si no tiene perfil de Dueño, retornar array vacío
    if (!dueno || !dueno.id) {
        return [];
    }

    // Filtrar mascotas exclusivamente por ese dueño
    return await mascotaModel.findByDuenoId(dueno.id);
};

// OBTENER MASCOTA POR ID
export const obtenerMascota = async (id: number): Promise<IMascota | null> => {
    return await mascotaModel.findById(id);
};

// ELIMINAR MASCOTA (Dueño o Admin)
export const eliminarMascota = async (mascotaId: number, userId: number, userRole: string): Promise<void> => {
    const mascota = await mascotaModel.findById(mascotaId);
    if (!mascota) throw new Error('Mascota no encontrada');

    // Si es admin, puede borrar directo
    if (userRole === 'admin') {
        await mascotaModel.deleteById(mascotaId);
        return;
    }

    // Si es cliente, verificar que sea el dueño
    const dueno = await duenoModel.findByUserId(userId);
    if (!dueno || dueno.id !== mascota.dueno_id) {
        throw new Error('No tienes permiso para eliminar esta mascota');
    }

    await mascotaModel.deleteById(mascotaId);
};

// ACTUALIZAR MASCOTA (Solo Dueño)
export const actualizarMascota = async (mascotaId: number, userId: number, datos: Partial<IMascota>): Promise<void> => {
    const mascota = await mascotaModel.findById(mascotaId);
    if (!mascota) throw new Error('Mascota no encontrada');

    const dueno = await duenoModel.findByUserId(userId);
    if (!dueno || dueno.id !== mascota.dueno_id) {
        throw new Error('No tienes permiso para editar esta mascota');
    }

    await mascotaModel.update(mascotaId, datos);
};