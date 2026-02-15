// DEFINICION DE TIPOS PARA TURNOS

export type TurnoEstado = 'pendiente' | 'confirmado' | 'cancelado' | 'realizado';

export interface Turno {
    id: string;
    mascotaId: string;
    mascotaNombre: string;
    fecha: string; //  formato YYYY-MM-DD
    hora: string;  // HH:mm
    motivo: string;
    estado: TurnoEstado;
    veterinarioId?: string;
    veterinarioNombre?: string;
}
