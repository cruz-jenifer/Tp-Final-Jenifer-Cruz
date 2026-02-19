import { RowDataPacket } from 'mysql2';

// INTERFAZ DUENO (COLUMNAS REALES DE LA TABLA)
export interface IDueno extends RowDataPacket {
    id: number;
    usuario_id: number;
    telefono: string;
    dni?: string;
    // CAMPOS DE JOIN CON USUARIOS
    nombre?: string;
    apellido?: string;
    email?: string;
}