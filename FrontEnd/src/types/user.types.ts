// INTERFAZ DE USUARIO
export interface Usuario {
    id: number;
    email: string;
    rol: 'admin' | 'veterinario' | 'cliente';
    nombre: string;
    apellido: string;
}

// ESTADO DE AUTENTICACION EN ESPAÑOL
export interface EstadoAutenticacion {
    usuario: Usuario | null;
    token: string | null;
    estaAutenticado: boolean;
    cargando: boolean;
    error: string | null;
}
