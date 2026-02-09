import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { pool } from '../config/database';

export interface IHistorial {
    id?: number;
    mascota_id: number;
    veterinario_id: number;
    fecha?: Date | string;
    diagnostico: string;
    tratamiento: string;
    observaciones?: string;
}

export class HistorialModel {

    // CREAR REGISTRO MEDICO
    static async create(historial: IHistorial): Promise<number> {
        const [result] = await pool.query<ResultSetHeader>(
            'INSERT INTO historiales (mascota_id, veterinario_id, fecha, diagnostico, tratamiento, observaciones) VALUES (?, ?, ?, ?, ?, ?)',
            [
                historial.mascota_id,
                historial.veterinario_id,
                historial.fecha || new Date(), // SI NO VIENE FECHA, PONEMOS AHORA
                historial.diagnostico,
                historial.tratamiento,
                historial.observaciones || null
            ]
        );
        return result.insertId;
    }

    // OBTENER HISTORIAL POR MASCOTA
    static async findByMascotaId(mascotaId: number): Promise<any[]> {
        const query = `
            SELECT 
                h.id, h.fecha, h.diagnostico, h.tratamiento, h.observaciones,
                v.nombre as vet_nombre, 
                v.apellido as vet_apellido, 
                v.matricula
            FROM historiales h
            JOIN veterinarios v ON h.veterinario_id = v.id
            WHERE h.mascota_id = ?
            ORDER BY h.fecha DESC
        `;
        
        const [rows] = await pool.query<RowDataPacket[]>(query, [mascotaId]);
        return rows;
    }
}