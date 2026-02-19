// ENUMS GLOBALES DEL SISTEMA

// ESTADOS POSIBLES PARA UN TURNO
export enum EstadoTurno {
    PENDIENTE = 'pendiente',
    CONFIRMADO = 'confirmado',
    CANCELADO = 'cancelado',
    COMPLETADO = 'completado'
}

// ROLES DE USUARIO (IDs de Base de Datos)
export enum RolId {
    ADMIN = 1,
    VETERINARIO = 2,
    CLIENTE = 3
}

// NOMBRES DE ROLES (Strings para lógica de negocio)
export enum RolNombre {
    ADMIN = 'admin',
    VETERINARIO = 'veterinario',
    CLIENTE = 'cliente'
}

// FORMATO DE RESPUESTA PARA EL ERROR MIDDLEWARE
export interface AppError extends Error {
    statusCode?: number;
    details?: string;
}
