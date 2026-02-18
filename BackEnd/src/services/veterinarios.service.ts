import { VeterinarioModel, IVeterinario } from '../models/veterinarios.model';
import * as userModel from '../models/usuarios.model';
import bcrypt from 'bcrypt';

// CREAR VETERINARIO
export const registrarVeterinario = async (datos: { nombre: string; apellido: string; email: string; matricula: string }): Promise<IVeterinario & { clave_temporal: string }> => {

    // VERIFICAR EMAIL
    const existingUser = await userModel.findByEmail(datos.email);
    if (existingUser) throw new Error('EL EMAIL YA ESTA REGISTRADO');

    // GENERAR PASSWORD TEMPORAL
    const password = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(password, 10);

    // CREAR USUARIO BASE
    const newUser = await userModel.create({
        email: datos.email,
        password: hashedPassword,
        rol: 'veterinario'
    });

    // CREAR PERFIL VETERINARIO
    const nuevoVet = await VeterinarioModel.create({
        usuario_id: newUser.id,
        nombre: datos.nombre,
        apellido: datos.apellido,
        matricula: datos.matricula,
        clave_temporal: password
    });

    return { ...nuevoVet, email: datos.email, clave_temporal: password };
};

// ACTUALIZAR VETERINARIO
export const actualizarVeterinario = async (id: number, datos: Partial<IVeterinario>): Promise<IVeterinario> => {
    const vet = await VeterinarioModel.findById(id);
    if (!vet) throw new Error('VETERINARIO NO ENCONTRADO');

    await VeterinarioModel.update(id, datos);
    return { ...vet, ...datos };
};

// ELIMINAR VETERINARIO
export const eliminarVeterinario = async (id: number): Promise<void> => {
    const vet = await VeterinarioModel.findById(id);
    if (!vet) throw new Error('VETERINARIO NO ENCONTRADO');

    // ELIMINAR PERFIL
    await VeterinarioModel.deleteById(id);

    // ELIMINAR USUARIO
    await userModel.deleteById(vet.usuario_id);
};
