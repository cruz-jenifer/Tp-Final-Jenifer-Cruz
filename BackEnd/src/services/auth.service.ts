import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as userModel from '../models/usuarios.model';
import * as duenoModel from '../models/dueno.model'; // IMPORTACION CLAVE
import { IUsuario } from '../models/usuarios.model';
import { LoginResponse, RolUsuario } from '../types/auth.types';

// REGISTRO DE USUARIO
export const register = async (userData: IUsuario) => {
    const existingUser = await userModel.findByEmail(userData.email);
    if (existingUser) {
        throw new Error('EL USUARIO YA EXISTE');
    }

    const hashedPassword = await bcrypt.hash(userData.password!, 10);

    // CREAR USUARIO
    const newUser = await userModel.create({
        email: userData.email,
        password: hashedPassword,
        rol: userData.rol || 'cliente'
    });

    return newUser;
};

// LOGIN
export const login = async (credentials: { email: string, password: string }): Promise<LoginResponse> => {
    const user = await userModel.findByEmail(credentials.email);

    if (!user || !user.password) {
        throw new Error('CREDENCIALES INVALIDAS');
    }

    const isMatch = await bcrypt.compare(credentials.password, user.password);
    if (!isMatch) {
        throw new Error('CREDENCIALES INVALIDAS');
    }

    // GENERAR TOKEN
    const token = jwt.sign(
        { id: user.id, email: user.email, rol: user.rol },
        'UTN_PATITAS_2024',
        { expiresIn: '2h' }
    );

    // BUSCAR PERFIL
    const perfil = await duenoModel.findByUserId(user.id);

    // RESPUESTA
    return {
        token,
        user: {
            id: user.id,
            email: user.email,
            rol: user.rol as RolUsuario,
            nombre: perfil ? perfil.nombre : undefined,
            apellido: perfil ? perfil.apellido : undefined
        }
    };
};