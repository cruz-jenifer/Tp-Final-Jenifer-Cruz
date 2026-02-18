import * as duenoModel from '../models/dueno.model';
import { IDueno } from '../models/interfaces/dueno.interface';
import * as userModel from '../models/usuarios.model';
import bcrypt from 'bcrypt';

// CREAR DUENO
export const registrarPerfil = async (userId: number, datos: { nombre: string, apellido: string, telefono: string }): Promise<IDueno> => {
    // VALIDAR EXISTENCIA
    const existente = await duenoModel.findByUserId(userId);

    if (existente) {
        throw new Error('EL USUARIO YA TIENE PERFIL');
    }

    // CREAR PERFIL
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
    if (!dueno || !dueno.id) throw new Error('PERFIL NO ENCONTRADO');

    await duenoModel.update(dueno.id, datos);

    return { ...dueno, ...datos };
};

// ELIMINAR DUENO
export const eliminarDueno = async (duenoId: number): Promise<void> => {
    const dueno = await duenoModel.findById(duenoId);
    if (!dueno) throw new Error('DUENO NO ENCONTRADO');

    await duenoModel.deleteById(duenoId);
};

// OBTENER TODOS LOS DUENOS
export const obtenerTodos = async (): Promise<IDueno[]> => {
    return await duenoModel.findAll();
};

// CREAR USUARIO BASE
const crearUsuarioBase = async (email: string, passwordPlain: string): Promise<number> => {
    const existingUser = await userModel.findByEmail(email);
    if (existingUser) throw new Error('EL EMAIL YA ESTA REGISTRADO');

    const hashedPassword = await bcrypt.hash(passwordPlain, 10);
    const newUser = await userModel.create({
        email,
        password: hashedPassword,
        rol: 'cliente'
    });
    return newUser.id;
};

// REGISTRAR DUENO DESDE ADMIN
export const registrarNuevoDuenoAdmin = async (datos: { nombre: string, apellido: string, email: string, telefono: string, dni?: string }): Promise<IDueno & { clave_temporal: string }> => {
    // GENERAR PASSWORD
    const password = Math.random().toString(36).slice(-8);

    // CREAR USUARIO
    const usuarioId = await crearUsuarioBase(datos.email, password);

    // CREAR PERFIL
    const nuevoDueno = await duenoModel.create({
        usuario_id: usuarioId,
        nombre: datos.nombre,
        apellido: datos.apellido,
        telefono: datos.telefono,
        dni: datos.dni,
        clave_temporal: password
    });

    return { ...nuevoDueno, clave_temporal: password };
};