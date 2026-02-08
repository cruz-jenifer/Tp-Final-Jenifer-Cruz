import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { pool } from '../config/database';
import { IDueno } from './interfaces/dueno.interface';

// BUSCAR DUENO POR ID DE USUARIO
export const findByUserId = async (userId: number): Promise<IDueno | null> => {
    const [rows] = await pool.query<IDueno[]>(
        'SELECT * FROM duenos WHERE usuario_id = ?',
        [userId]
    );
    return rows.length ? rows[0] : null;
};

// CREAR NUEVO PERFIL DE DUENO
export const create = async (dueno: Omit<IDueno, 'id'>): Promise<IDueno> => {
    const [result] = await pool.execute<ResultSetHeader>(
        'INSERT INTO duenos (usuario_id, nombre, apellido, telefono) VALUES (?, ?, ?, ?)',
        [dueno.usuario_id, dueno.nombre, dueno.apellido, dueno.telefono]
    );
   
    return { id: result.insertId, ...dueno } as IDueno;
};