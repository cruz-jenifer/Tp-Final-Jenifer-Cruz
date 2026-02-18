import { RowDataPacket } from 'mysql2';

// INTERFAZ DUENO
export interface IDueno extends RowDataPacket {
    id: number;
    usuario_id: number;
    nombre: string;
    apellido: string;
    telefono: string;
    dni?: string;
    clave_temporal?: string;
}