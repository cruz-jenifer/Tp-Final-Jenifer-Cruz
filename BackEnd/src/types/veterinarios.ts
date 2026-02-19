import { RowDataPacket } from 'mysql2';

// 1. REFLEJO EXACTO DE LA TABLA (PARA INSERTS/UPDATES)
export interface Veterinario extends RowDataPacket {
    id: number;
    usuario_id: number;
    matricula: string;
}

// 2. RESPUESTA AL FRONTEND (JOIN CON USUARIOS)
export interface VeterinarioResponse extends Veterinario {
    nombre: string;
    apellido: string;
    email: string;
}
