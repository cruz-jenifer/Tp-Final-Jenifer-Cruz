import { RowDataPacket } from 'mysql2';

// INTERFAZ DE BASE DE DATOS PARA SERVICIOS
export interface IServicio extends RowDataPacket {
    id?: number;
    nombre: string;
    precio: number;
    duracion_minutos: number;
}