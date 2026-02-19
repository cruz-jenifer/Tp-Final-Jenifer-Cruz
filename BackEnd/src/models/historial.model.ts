
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { pool } from '../config/database';

// INTERFAZ HISTORIAL MEDICO
export interface HistorialMedico extends RowDataPacket {
    id: number;
    mascota_id: number;
    veterinario_id: number;
    fecha: string;
    diagnostico: string;
    tratamiento: string;
    created_at: string;
}

export interface CreateHistorialDto {
    mascota_id: number;
    veterinario_id: number;
    fecha?: string;
    diagnostico: string;
    tratamiento: string;
}

// INTERFAZ CON DETALLES (JOINS)
export interface HistorialDetalle extends HistorialMedico {
    mascota_nombre?: string;
    mascota_especie?: string;
    dueno_nombre?: string;
    dueno_apellido?: string;
    vet_nombre?: string;
    vet_apellido?: string;
    matricula?: string;
}

// QUERY BASE CON JOINS
const BASE_DETAIL_SELECT = `
    SELECT 
        h.id, h.fecha, h.diagnostico, h.tratamiento, h.created_at,
        h.mascota_id, h.veterinario_id,
        m.nombre as mascota_nombre,
        e.nombre as mascota_especie,
        ud.nombre as dueno_nombre,
        ud.apellido as dueno_apellido,
        uv.nombre as vet_nombre,
        uv.apellido as vet_apellido,
        v.matricula
    FROM historial_medico h
    JOIN mascotas m ON h.mascota_id = m.id
    JOIN razas r ON m.raza_id = r.id
    JOIN especies e ON r.especie_id = e.id
    JOIN duenos d ON m.dueno_id = d.id
    JOIN usuarios ud ON d.usuario_id = ud.id
    JOIN veterinarios v ON h.veterinario_id = v.id
    JOIN usuarios uv ON v.usuario_id = uv.id
`;

export class HistorialModel {

    // CREAR HISTORIAL
    static async create(historial: CreateHistorialDto): Promise<number> {
        const [result] = await pool.query<ResultSetHeader>(
            'INSERT INTO historial_medico (mascota_id, veterinario_id, fecha, diagnostico, tratamiento) VALUES (?, ?, ?, ?, ?)',
            [
                historial.mascota_id,
                historial.veterinario_id,
                historial.fecha || new Date().toISOString().split('T')[0],
                historial.diagnostico,
                historial.tratamiento
            ]
        );
        return result.insertId;
    }

    // OBTENER HISTORIAL POR MASCOTA
    static async findByMascotaId(mascotaId: number): Promise<HistorialDetalle[]> {
        const query = `
            ${BASE_DETAIL_SELECT}
            WHERE h.mascota_id = ?
            ORDER BY h.fecha DESC
        `;
        const [rows] = await pool.query<HistorialDetalle[]>(query, [mascotaId]);
        return rows;
    }

    // BUSCAR HISTORIALES RECIENTES POR VETERINARIO
    static async findRecentByVeterinarioId(veterinarioId: number, limit: number = 5): Promise<HistorialDetalle[]> {
        const query = `
            ${BASE_DETAIL_SELECT}
            WHERE h.veterinario_id = ?
            ORDER BY h.fecha DESC
            LIMIT ?
        `;
        const [rows] = await pool.query<HistorialDetalle[]>(query, [veterinarioId, limit]);
        return rows;
    }

    // BUSCAR TODOS LOS HISTORIALES
    static async findAll(): Promise<HistorialDetalle[]> {
        const query = `
            ${BASE_DETAIL_SELECT}
            ORDER BY h.fecha DESC
        `;
        const [rows] = await pool.query<HistorialDetalle[]>(query);
        return rows;
    }

    // BUSCAR POR ID
    static async findById(id: number): Promise<HistorialMedico | null> {
        const [rows] = await pool.query<HistorialMedico[]>(
            'SELECT * FROM historial_medico WHERE id = ?',
            [id]
        );
        return rows.length ? rows[0] : null;
    }

    // ELIMINAR HISTORIAL
    static async delete(id: number): Promise<void> {
        await pool.query('DELETE FROM historial_medico WHERE id = ?', [id]);
    }

    // ACTUALIZAR HISTORIAL
    static async update(id: number, data: Partial<CreateHistorialDto>): Promise<void> {
        await pool.query(
            'UPDATE historial_medico SET diagnostico = ?, tratamiento = ? WHERE id = ?',
            [data.diagnostico, data.tratamiento, id]
        );
    }
}