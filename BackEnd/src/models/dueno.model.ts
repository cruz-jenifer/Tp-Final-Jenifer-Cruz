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

// OBTENER TODOS LOS DUENOS (ADMIN)
export const findAll = async (): Promise<IDueno[]> => {
    const [rows] = await pool.query<IDueno[]>(
        `SELECT d.*, u.email 
         FROM duenos d
         JOIN usuarios u ON d.usuario_id = u.id`
    );
    return rows;
};

// CREAR NUEVO PERFIL DE DUENO
export const create = async (dueno: Omit<IDueno, 'id'>): Promise<IDueno> => {
    const [result] = await pool.execute<ResultSetHeader>(
        'INSERT INTO duenos (usuario_id, nombre, apellido, telefono) VALUES (?, ?, ?, ?)',
        [dueno.usuario_id, dueno.nombre, dueno.apellido, dueno.telefono]
    );

    return { id: result.insertId, ...dueno } as IDueno;
};

// ACTUALIZAR PERFIL
export const update = async (id: number, datos: Partial<IDueno>): Promise<void> => {
    await pool.query(
        'UPDATE duenos SET nombre = ?, apellido = ?, telefono = ? WHERE id = ?',
        [datos.nombre, datos.apellido, datos.telefono, id]
    );
};

// ELIMINAR DUENO (ADMIN)
export const deleteById = async (id: number): Promise<void> => {
    await pool.query('DELETE FROM duenos WHERE id = ?', [id]);
};

// BUSCAR POR ID (PK)
export const findById = async (id: number): Promise<IDueno | null> => {
    const [rows] = await pool.query<IDueno[]>(
        'SELECT * FROM duenos WHERE id = ?',
        [id]
    );
    return rows.length ? rows[0] : null;
};