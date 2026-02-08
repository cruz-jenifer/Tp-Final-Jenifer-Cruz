import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { pool } from '../config/database';

export interface Reserva {
    id?: number;
    fecha: string;
    hora: string;
    motivo: string;
    estado?: string;
    user_id: number;
    mascota_id?: number; // Opcional
}

// Crear una reserva
export const create = async (reserva: Reserva): Promise<Reserva> => {
    const [result] = await pool.execute<ResultSetHeader>(
        'INSERT INTO reservas (fecha, hora, motivo, user_id, mascota_id) VALUES (?, ?, ?, ?, ?)',
        [reserva.fecha, reserva.hora, reserva.motivo, reserva.user_id, reserva.mascota_id || null]
    );
    return { id: result.insertId, ...reserva };
};

// Obtener reservas SOLO del usuario (Feat 5: Entidad Protegida)
export const findByUserId = async (userId: number): Promise<Reserva[]> => {
    const [rows] = await pool.query<RowDataPacket[]>(
        'SELECT * FROM reservas WHERE user_id = ? ORDER BY fecha DESC, hora ASC',
        [userId]
    );
    return rows as Reserva[];
};

// Obtener una reserva por ID (para verificar dueño)
export const findById = async (id: number): Promise<Reserva | null> => {
    const [rows] = await pool.query<RowDataPacket[]>(
        'SELECT * FROM reservas WHERE id = ?',
        [id]
    );
    return rows.length ? (rows[0] as Reserva) : null;
};

// Eliminar reserva
export const remove = async (id: number): Promise<void> => {
    await pool.execute('DELETE FROM reservas WHERE id = ?', [id]);
};