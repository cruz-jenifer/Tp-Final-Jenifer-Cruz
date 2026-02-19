import * as DuenoModel from '../models/dueno.model';
import { IDueno } from '../models/interfaces/dueno.interface';
import * as UserModel from '../models/user.model';
import bcrypt from 'bcrypt';

// CREAR PERFIL DUENO (AUTOREGISTRO)
export const registrarPerfil = async (userId: number, datos: { telefono: string; dni?: string }): Promise<IDueno> => {
    // VALIDAR EXISTENCIA
    const existente = await DuenoModel.findByUserId(userId);

    if (existente) {
        throw new Error('EL USUARIO YA TIENE PERFIL');
    }

    // CREAR PERFIL (SOLO DATOS DE DUENOS)
    const nuevoDueno = await DuenoModel.create({
        usuario_id: userId,
        telefono: datos.telefono,
        dni: datos.dni
    });

    return nuevoDueno;
};

// OBTENER PERFIL POR USUARIO
export const obtenerPerfil = async (userId: number): Promise<IDueno | null> => {
    return await DuenoModel.findByUserId(userId);
};

// ACTUALIZAR PERFIL
export const actualizarPerfil = async (userId: number, datos: { nombre?: string; apellido?: string; telefono?: string; dni?: string }): Promise<IDueno> => {
    const dueno = await DuenoModel.findByUserId(userId);
    if (!dueno || !dueno.id) throw new Error('PERFIL NO ENCONTRADO');

    // ACTUALIZAR DATOS EN DUENOS (TELEFONO/DNI)
    if (datos.telefono || datos.dni) {
        await DuenoModel.update(dueno.id, { telefono: datos.telefono, dni: datos.dni });
    }

    // ACTUALIZAR NOMBRE/APELLIDO EN USUARIOS
    if (datos.nombre || datos.apellido) {
        await UserModel.updateNombreApellido(
            dueno.usuario_id,
            datos.nombre || dueno.nombre || '',
            datos.apellido || dueno.apellido || ''
        );
    }

    // RETORNAR PERFIL ACTUALIZADO
    const actualizado = await DuenoModel.findById(dueno.id);
    if (!actualizado) throw new Error('ERROR AL ACTUALIZAR PERFIL');
    return actualizado;
};

// ELIMINAR DUENO
export const eliminarDueno = async (duenoId: number): Promise<void> => {
    const dueno = await DuenoModel.findById(duenoId);
    if (!dueno) throw new Error('DUENO NO ENCONTRADO');

    // ELIMINAR USUARIO (CASCADE BORRA DUENO)
    await UserModel.deleteById(dueno.usuario_id);
};

// OBTENER TODOS LOS DUENOS
export const obtenerTodos = async (): Promise<IDueno[]> => {
    return await DuenoModel.findAll();
};

// REGISTRAR DUENO DESDE ADMIN (CON USUARIO BASE)
export const registrarNuevoDuenoAdmin = async (datos: { nombre: string; apellido: string; email: string; telefono: string; dni?: string }): Promise<IDueno & { clave_temporal: string }> => {
    // VERIFICAR EMAIL DUPLICADO
    const usuario_existente = await UserModel.findByEmail(datos.email);
    if (usuario_existente) throw new Error('EL EMAIL YA ESTA REGISTRADO');

    // OBTENER ID DEL ROL CLIENTE
    const id_rol_cliente = await UserModel.getRolIdByNombre('cliente');

    if (!id_rol_cliente) {
        throw new Error('ROL DE CLIENTE NO ENCONTRADO EN LA BASE DE DATOS. VERIFICAR TABLA ROLES.');
    }

    // GENERAR CLAVE TEMPORAL
    const clave_temporal = Math.random().toString(36).slice(-8);
    const hash_password = await bcrypt.hash(clave_temporal, 10);

    // CREAR USUARIO BASE
    const nuevo_usuario_id = await UserModel.create({
        email: datos.email,
        password_hash: hash_password,
        nombre: datos.nombre,
        apellido: datos.apellido,
        rol_id: id_rol_cliente
    });

    // CREAR PERFIL DE DUENO
    const datos_dueno = {
        usuario_id: nuevo_usuario_id,
        telefono: datos.telefono,
        dni: datos.dni
    };
    const nuevo_dueno = await DuenoModel.create(datos_dueno);

    return { ...nuevo_dueno, clave_temporal };
};
