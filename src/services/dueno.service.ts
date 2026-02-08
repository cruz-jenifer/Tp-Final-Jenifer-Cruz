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