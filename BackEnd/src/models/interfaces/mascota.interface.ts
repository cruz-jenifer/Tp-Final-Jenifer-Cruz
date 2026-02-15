import { RowDataPacket } from 'mysql2';

// INTERFAZ DE MASCOTA BASE DE DATOS
export interface IMascota extends RowDataPacket {
    id: number;
    nombre: string;
    especie: string;
    raza: string;
    fecha_nacimiento: Date;
    advertencias: string;
    dueno_id: number;
    creado_en?: Date;
}