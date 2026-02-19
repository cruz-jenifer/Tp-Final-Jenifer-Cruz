// DEFINICION DE TIPOS PARA DUEÑOS

export interface Owner {
    id: number;
    usuario_id: number;
    telefono: string;
    dni?: string;
    // CAMPOS DE JOIN CON USUARIOS
    nombre?: string;
    apellido?: string;
    email?: string;
    // CAMPO TRANSITORIO (SOLO AL CREAR)
    clave_temporal?: string;
}
