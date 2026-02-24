// ENUMS GLOBALES DEL SISTEMA

// ESTADOS POSIBLES PARA UN TURNO
export enum EstadoTurno {
    PENDIENTE = 'pendiente',
    CONFIRMADO = 'confirmado',
    CANCELADO = 'cancelado',
    COMPLETADO = 'completado'
}

// ROLES DE USUARIO POR IDENTIFICADOR
export enum RolId {
    ADMIN = 1,
    VETERINARIO = 2,
    CLIENTE = 3
}

// NOMBRES DE ROLES
export enum RolNombre {
    ADMIN = 'admin',
    VETERINARIO = 'veterinario',
    CLIENTE = 'cliente'
}

// INTERFAZ DE ERROR PERSONALIZADO
export interface AppError extends Error {
    statusCode?: number;
    details?: string;
}
