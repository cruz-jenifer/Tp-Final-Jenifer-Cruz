import * as VeterinarioModel from '../models/veterinarios.model';
import { VeterinarioResponse } from '../types/veterinarios';
import * as UserModel from '../models/user.model';
import bcrypt from 'bcrypt';

// CREAR VETERINARIO (DESDE ADMIN)
export const registrarVeterinario = async (datos: { nombre: string; apellido: string; email: string; matricula: string }): Promise<VeterinarioResponse & { clave_temporal: string }> => {

    // VERIFICAR EMAIL
    const existingUser = await UserModel.findByEmail(datos.email);
    if (existingUser) throw new Error('EL EMAIL YA ESTA REGISTRADO');

    // OBTENER ROL_ID PARA VETERINARIO
    const rolId = await UserModel.getRolIdByNombre('veterinario');
    if (!rolId) throw new Error('ROL VETERINARIO NO ENCONTRADO');

    // GENERAR PASSWORD TEMPORAL
    const password = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(password, 10);

    // CREAR USUARIO BASE (NOMBRE/APELLIDO VAN EN USUARIOS)
    const usuarioId = await UserModel.create({
        email: datos.email,
        password_hash: hashedPassword,
        nombre: datos.nombre,
        apellido: datos.apellido,
        rol_id: rolId
    });

    // CREAR PERFIL VETERINARIO (SOLO MATRICULA)
    // CORREGIDO: Pasar argumentos separados, no objeto
    const vetId = await VeterinarioModel.create(usuarioId, datos.matricula);

    // RETORNAR PERFIL COMPLETO
    const nuevoVet = await VeterinarioModel.findById(vetId);
    if (!nuevoVet) throw new Error('ERROR AL CREAR VETERINARIO');

    return { ...nuevoVet, clave_temporal: password };
};

// ACTUALIZAR VETERINARIO
export const actualizarVeterinario = async (id: number, datos: { nombre?: string; apellido?: string; matricula?: string }): Promise<VeterinarioResponse> => {
    const vet = await VeterinarioModel.findById(id);
    if (!vet) throw new Error('VETERINARIO NO ENCONTRADO');

    // ACTUALIZAR MATRICULA EN VETERINARIOS
    if (datos.matricula) {
        await VeterinarioModel.update(id, datos.matricula);
    }

    // ACTUALIZAR NOMBRE/APELLIDO EN USUARIOS
    if (datos.nombre || datos.apellido) {
        // CORREGIDO: Usar los valores existentes si no se envían nuevos, asegurando que no sean undefined
        await UserModel.updateNombreApellido(
            vet.usuario_id,
            datos.nombre || vet.nombre || '',
            datos.apellido || vet.apellido || ''
        );
    }

    // RETORNAR PERFIL ACTUALIZADO
    const actualizado = await VeterinarioModel.findById(id);
    if (!actualizado) throw new Error('ERROR AL ACTUALIZAR VETERINARIO');
    return actualizado;
};

// ELIMINAR VETERINARIO
export const eliminarVeterinario = async (id: number): Promise<void> => {
    const vet = await VeterinarioModel.findById(id);
    if (!vet) throw new Error('VETERINARIO NO ENCONTRADO');

    // ELIMINAR USUARIO (CASCADE BORRA VETERINARIO)
    await UserModel.deleteById(vet.usuario_id);
};
