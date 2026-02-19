// DEFINICION DE TIPOS PARA TURNOS

export type TurnoEstado = 'pendiente' | 'confirmado' | 'cancelado' | 'completado';

export interface Turno {
    id: number;
    fecha: string;
    hora: string;
    estado: TurnoEstado;
    motivo_consulta: string;
    created_at?: string;
    // IDS PARA CREACION/VINCULACION
    mascota_id?: number;
    dueno_id?: number;
    servicio_id?: number;
    veterinario_id?: number;
    // CAMPOS EXPANDIDOS DE JOINS
    mascota?: string;
    mascota_especie?: string;
    servicio?: string;
    veterinario_nombre?: string;
    veterinario_apellido?: string;
    dueno_nombre?: string;
    dueno_apellido?: string;
}
