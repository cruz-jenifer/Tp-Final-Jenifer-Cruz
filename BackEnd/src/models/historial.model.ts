
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

    // CREAR HISTORIAL
    static async create(historial: IHistorial): Promise<number> {
        const [result] = await pool.query<ResultSetHeader>(
            'INSERT INTO historiales (mascota_id, veterinario_id, fecha, diagnostico, tratamiento, observaciones) VALUES (?, ?, ?, ?, ?, ?)',
            [
                historial.mascota_id,
                historial.veterinario_id,
                historial.fecha || new Date(),
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

    // BUSCAR HISTORIALES RECIENTES POR VETERINARIO
    static async findRecentByVeterinarioId(veterinarioId: number, limit: number = 5): Promise<any[]> {
        const query = `
            SELECT 
                h.id, h.fecha, h.diagnostico, h.tratamiento,
                h.mascota_id,
                m.nombre as mascota_nombre,
                m.especie as mascota_especie,
                d.nombre as dueno_nombre,
                d.apellido as dueno_apellido
            FROM historiales h
            JOIN mascotas m ON h.mascota_id = m.id
            JOIN duenos d ON m.dueno_id = d.id
            WHERE h.veterinario_id = ?
            ORDER BY h.fecha DESC
            LIMIT ?
        `;

        const [rows] = await pool.query<RowDataPacket[]>(query, [veterinarioId, limit]);
        return rows;
    }

    // BUSCAR TODOS LOS HISTORIALES
    static async findAll(): Promise<any[]> {
        const query = `
            SELECT 
                h.id, h.fecha, h.diagnostico, h.tratamiento,
                m.nombre as mascota_nombre, m.especie as mascota_especie,
                d.nombre as dueno_nombre, d.apellido as dueno_apellido,
                v.nombre as vet_nombre, v.apellido as vet_apellido
            FROM historiales h
            JOIN mascotas m ON h.mascota_id = m.id
            JOIN duenos d ON m.dueno_id = d.id
            JOIN veterinarios v ON h.veterinario_id = v.id
            ORDER BY h.fecha DESC
        `;
        const [rows] = await pool.query<RowDataPacket[]>(query);
        return rows;
    }

    // BUSCAR POR ID
    static async findById(id: number): Promise<any> {
        const [rows] = await pool.query<RowDataPacket[]>(
            'SELECT * FROM historiales WHERE id = ?',
            [id]
        );
        return rows.length ? rows[0] : null;
    }

    // ELIMINAR HISTORIAL
    static async delete(id: number): Promise<void> {
        await pool.query('DELETE FROM historiales WHERE id = ?', [id]);
    }

    // ACTUALIZAR HISTORIAL
    static async update(id: number, data: Partial<IHistorial>): Promise<void> {
        await pool.query(
            'UPDATE historiales SET diagnostico = ?, tratamiento = ?, observaciones = ? WHERE id = ?',
            [data.diagnostico, data.tratamiento, data.observaciones || null, id]
        );
    }
}