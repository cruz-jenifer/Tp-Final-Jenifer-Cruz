// INTERFAZ DE USUARIO
export interface User {
    id: number;
    email: string;
    rol: 'admin' | 'veterinario' | 'cliente';
    nombre: string;
}

// ESTADO DE AUTENTICACION
export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
}
