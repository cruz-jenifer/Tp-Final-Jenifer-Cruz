import { RowDataPacket } from 'mysql2';

export interface Turno {
    id?: number;
    mascota_id: number;
    servicio_id: number;
    veterinario_id: number;
    fecha_hora: string; // Formato 'YYYY-MM-DD HH:mm:ss'
    motivo: string;
    estado?: 'pendiente' | 'confirmado' | 'completado' | 'cancelado';
}

// Extensión para cuando consultamos y MySQL devuelve metadatos extra
export interface TurnoRow extends RowDataPacket, Turno {}