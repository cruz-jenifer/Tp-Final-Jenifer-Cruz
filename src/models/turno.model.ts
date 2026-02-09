import { RowDataPacket, ResultSetHeader } from 'mysql2';
import {pool} from '../config/database';

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

export class TurnoModel {

    // VALIDAR DISPONIBILIDAD HORARIA
    static async validarDisponibilidad(veterinarioId: number, fechaHora: string): Promise<boolean> {
        const [rows] = await pool.query<RowDataPacket[]>(
            'SELECT COUNT(*) as count FROM turnos WHERE veterinario_id = ? AND fecha_hora = ?',
            [veterinarioId, fechaHora]
        );
        return rows[0].count === 0;
    }

    // CREAR TURNO
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

    // OBTENER TURNOS POR DUENO CON DETALLES
    static async findAllByDuenoId(duenoId: number): Promise<any[]> {
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
        return rows;
    }
}