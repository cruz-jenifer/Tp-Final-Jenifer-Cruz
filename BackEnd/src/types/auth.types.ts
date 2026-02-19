import { ApiResponse } from './api.types';
import { RolNombre } from './enums';

// DEFINICION DE ROLES (USO CENTRALIZADO)
export type RolUsuario = RolNombre;

// ESTRUCTURA DEL PAYLOAD JWT
export interface UserPayload {
    id: number;
    email: string;
    rol: RolUsuario;
}

// DATOS DE USUARIO EN LOGIN
export interface UserLoginData {
    id: number;
    email: string;
    rol: RolUsuario;
    nombre: string;
    apellido: string;
}

// RESPUESTA DEL LOGIN ENRIQUECIDO
export interface LoginResponseData {
    token: string;
    user: UserLoginData;
}

export type LoginApiResponse = ApiResponse<LoginResponseData>;

// EXTENSION DE LA INTERFAZ REQUEST DE EXPRESS
declare global {
    namespace Express {
        interface Request {
            user?: UserPayload;
        }
    }
}