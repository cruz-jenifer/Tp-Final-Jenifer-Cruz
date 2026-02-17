import * as duenoModel from '../models/dueno.model';
import { IDueno } from '../models/interfaces/dueno.interface';

// CREAR PERFIL DE DUENO
export const registrarPerfil = async (userId: number, datos: { nombre: string, apellido: string, telefono: string }): Promise<IDueno> => {
    // VALIDAR EXISTENCIA PREVIA
    const existente = await duenoModel.findByUserId(userId);

    if (existente) {
        throw new Error('EL USUARIO YA TIENE PERFIL');
    }

    // CREAR PERFIL VINCULADO
    return await duenoModel.create({
        usuario_id: userId,
        nombre: datos.nombre,
        apellido: datos.apellido,
        telefono: datos.telefono
    });
};

// OBTENER PERFIL POR USUARIO
export const obtenerPerfil = async (userId: number): Promise<IDueno | null> => {
    return await duenoModel.findByUserId(userId);
};

// ACTUALIZAR PERFIL
export const actualizarPerfil = async (userId: number, datos: Partial<IDueno>): Promise<IDueno> => {
    const dueno = await duenoModel.findByUserId(userId);
    if (!dueno || !dueno.id) throw new Error('Perfil no encontrado');

    await duenoModel.update(dueno.id, datos);

    return { ...dueno, ...datos };
};

// ELIMINAR DUENO (SOLO ADMIN)
export const eliminarDueno = async (duenoId: number): Promise<void> => {
    const dueno = await duenoModel.findById(duenoId);
    if (!dueno) throw new Error('Dueño no encontrado');

    await duenoModel.deleteById(duenoId);
};

// OBTENER TODOS LOS DUENOS (ADMIN)
export const obtenerTodos = async (): Promise<IDueno[]> => {
    return await duenoModel.findAll();
};