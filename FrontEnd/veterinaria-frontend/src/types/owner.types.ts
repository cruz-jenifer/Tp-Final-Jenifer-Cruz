// DEFINICION DE TIPOS PARA DUEÑOS

export interface Owner {
    id: number;
    usuario_id: number;
    nombre: string;
    apellido: string;
    telefono: string;
    email?: string; // PUEDE VENIR DEL JOIN CON USUARIOS
    dni?: string; // SI LO HUBIERA
    clave_temporal?: string; // CAMPO PARA CLAVE INICIAL
}
