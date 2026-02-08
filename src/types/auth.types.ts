// DEFINICION DE ROLES
export type RolUsuario = 'admin' | 'veterinario' | 'cliente';

// ESTRUCTURA DEL PAYLOAD JWT
export interface UserPayload {
    id: number;
    email: string;
    rol: RolUsuario;
}

// RESPUESTA DEL LOGIN ENRIQUECIDO
export interface LoginResponse {
    token: string;
    user: {
        id: number;
        email: string;
        rol: RolUsuario;
        nombre?: string;
        apellido?: string;
    };
}

// EXTENSION DE REQUEST EXPRESS
declare global {
    namespace Express {
        interface Request {
            user?: UserPayload;
        }
    }
}