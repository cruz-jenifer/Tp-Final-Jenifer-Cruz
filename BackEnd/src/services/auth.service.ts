import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as UserModel from '../models/user.model';
import { LoginResponseData, RolUsuario } from '../types/auth.types';

// REGISTRO DE USUARIO
export const register = async (userData: { email: string; password?: string; nombre: string; apellido: string; rol?: string }) => {
    const existingUser = await UserModel.findByEmail(userData.email);
    if (existingUser) {
        throw new Error('EL USUARIO YA EXISTE');
    }

    const hashedPassword = await bcrypt.hash(userData.password!, 10);

    // OBTENER ROL_ID
    const rolNombre = userData.rol || 'cliente';
    const rolId = await UserModel.getRolIdByNombre(rolNombre);
    if (!rolId) {
        throw new Error('ROL NO VALIDO');
    }

    // CREAR USUARIO
    const userId = await UserModel.create({
        email: userData.email,
        password_hash: hashedPassword,
        nombre: userData.nombre,
        apellido: userData.apellido,
        rol_id: rolId
    });

    return { id: userId, email: userData.email, rol: rolNombre };
};

// LOGIN
export const login = async (credentials: { email: string, password: string }): Promise<LoginResponseData> => {
    const user = await UserModel.findByEmail(credentials.email);

    if (!user || !user.password_hash) {
        throw new Error('CREDENCIALES INVALIDAS');
    }

    const isMatch = await bcrypt.compare(credentials.password, user.password_hash);
    if (!isMatch) {
        throw new Error('CREDENCIALES INVALIDAS');
    }

    // GENERAR TOKEN
    const token = jwt.sign(
        { id: user.id, email: user.email, rol: user.rol_nombre },
        process.env.JWT_SECRET || 'UTN_PATITAS_2024',
        { expiresIn: '2h' }
    );

    // RETORNAR DATOS
    return {
        token,
        user: {
            id: user.id,
            email: user.email,
            rol: user.rol_nombre as RolUsuario,
            nombre: user.nombre || '',
            apellido: user.apellido || ''
        }
    };
};
