// DEFINICION DE TIPOS PARA TURNOS

export type TurnoEstado = 'pendiente' | 'confirmado' | 'cancelado' | 'realizado';

export interface Turno {
    id: number;
    fecha_hora: string; // BACKEND ENVIA DATETIME COMPLETO
    estado: TurnoEstado;
    motivo: string;
    // IDS PARA CREACION/VINCULACION
    mascota_id?: number;
    servicio_id?: number;
    veterinario_id?: number;
    // CAMPOS EXPANDIDOS DE JOINS
    mascota?: string; // NOMBRE DE LA MASCOTA
    servicio?: string; // NOMBRE DEL SERVICIO
    veterinario_nombre?: string;
    veterinario_apellido?: string;
}
