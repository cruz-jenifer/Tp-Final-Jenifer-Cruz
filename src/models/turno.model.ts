import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { pool } from '../config/database';

export interface ITurno {
    id?: number;
    mascota_id: number;
    servicio_id: number;
    veterinario_id: number;
    fecha_hora: Date | string;
    motivo: string;
    estado?: 'pendiente' | 'confirmado' | 'cancelado' | 'realizado';
    creado_en?: Date;
}

export interface ITurnoDetalle extends ITurno {
    mascota?: string;
    servicio?: string;
    veterinario_nombre?: string;
    veterinario_apellido?: string;
    dueno_nombre?: string;
    dueno_apellido?: string;
}

export class TurnoModel {

    // VALIDAR DISPONIBILIDAD
    static async validarDisponibilidad(veterinarioId: number, fechaHora: string): Promise<boolean> {
        const [rows] = await pool.query<RowDataPacket[]>(
            'SELECT COUNT(*) as count FROM turnos WHERE veterinario_id = ? AND fecha_hora = ?',
            [veterinarioId, fechaHora]
        );
        return rows[0].count === 0;
    }

    // CREAR
    static async create(turno: ITurno): Promise<number> {
        const [result] = await pool.query<ResultSetHeader>(
            'INSERT INTO turnos (mascota_id, servicio_id, veterinario_id, fecha_hora, motivo, estado) VALUES (?, ?, ?, ?, ?, ?)',
            [
                turno.mascota_id,
                turno.servicio_id,
                turno.veterinario_id,
                turno.fecha_hora,
                turno.motivo,
                'pendiente'
            ]
        );
        return result.insertId;
    }

    // BUSCAR POR DUENO
    static async findAllByDuenoId(duenoId: number): Promise<ITurnoDetalle[]> {
        const query = `
            SELECT 
                t.id, 
                t.fecha_hora, 
                t.estado, 
                m.nombre as mascota, 
                s.nombre as servicio, 
                v.nombre as veterinario_nombre,
                v.apellido as veterinario_apellido
            FROM turnos t
            JOIN mascotas m ON t.mascota_id = m.id
            JOIN servicios s ON t.servicio_id = s.id
            JOIN veterinarios v ON t.veterinario_id = v.id
            WHERE m.dueno_id = ?
            ORDER BY t.fecha_hora DESC
        `;
        const [rows] = await pool.query<RowDataPacket[]>(query, [duenoId]);
        return rows as ITurnoDetalle[];
    }

    // BUSCAR POR FECHA
    static async findAllByFecha(fecha: string): Promise<ITurnoDetalle[]> {
        const query = `
            SELECT 
                t.id, 
                t.fecha_hora, 
                t.estado, 
                t.motivo,
                m.nombre as mascota, 
                d.nombre as dueno_nombre, 
                d.apellido as dueno_apellido,
                s.nombre as servicio
            FROM turnos t
            JOIN mascotas m ON t.mascota_id = m.id
            JOIN duenos d ON m.dueno_id = d.id
            JOIN servicios s ON t.servicio_id = s.id
            WHERE DATE(t.fecha_hora) = ?
            ORDER BY t.fecha_hora ASC
        `;

        // FORMATO MYSQL
        const [rows] = await pool.query<RowDataPacket[]>(query, [fecha]);
        return rows as ITurnoDetalle[];
    }

    // CANCELAR TURNO
    static async updateStatus(id: number, estado: 'cancelado'): Promise<void> {
        await pool.query(
            'UPDATE turnos SET estado = ? WHERE id = ?',
            [estado, id]
        );
    }

    // BUSCAR POR ID
    static async findById(id: number): Promise<ITurno | null> {
        const [rows] = await pool.query<RowDataPacket[]>(
            'SELECT * FROM turnos WHERE id = ?',
            [id]
        );
        if (rows.length === 0) return null;
        return rows[0] as ITurno;
    }

    // REPROGRAMAR (UPDATE)
    static async update(id: number, datos: Partial<ITurno>): Promise<void> {
        // Solo permitimos actualizar fecha, veterinario, motivo
        // Construccion dinamica basica o fija
        await pool.query(
            'UPDATE turnos SET fecha_hora = COALESCE(?, fecha_hora), veterinario_id = COALESCE(?, veterinario_id), motivo = COALESCE(?, motivo) WHERE id = ?',
            [datos.fecha_hora, datos.veterinario_id, datos.motivo, id]
        );
    }
}