import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { pool } from '../config/database';
import { IDueno } from './interfaces/dueno.interface';

// QUERY BASE CON JOIN USUARIOS
const BASE_SELECT = `
    SELECT d.id, d.usuario_id, d.telefono, d.dni,
           u.nombre, u.apellido, u.email
    FROM duenos d
    JOIN usuarios u ON d.usuario_id = u.id
`;

// BUSCAR DUENO POR USUARIO
export const findByUserId = async (userId: number): Promise<IDueno | null> => {
    const [rows] = await pool.query<IDueno[]>(
        `${BASE_SELECT} WHERE d.usuario_id = ?`,
        [userId]
    );
    return rows.length ? rows[0] : null;
};

// OBTENER TODOS LOS DUENOS
export const findAll = async (): Promise<IDueno[]> => {
    const [rows] = await pool.query<IDueno[]>(
        `${BASE_SELECT} ORDER BY u.apellido, u.nombre`
    );
    return rows;
};

// CREAR DUENO (SOLO COLUMNAS DE LA TABLA DUENOS)
export const create = async (dueno: { usuario_id: number; telefono: string; dni?: string }): Promise<IDueno> => {
    const [result] = await pool.execute<ResultSetHeader>(
        'INSERT INTO duenos (usuario_id, telefono, dni) VALUES (?, ?, ?)',
        [dueno.usuario_id, dueno.telefono, dueno.dni || null]
    );

    // RETORNAR CON JOIN
    const creado = await findById(result.insertId);
    return creado!;
};

// ACTUALIZAR DUENO (SOLO COLUMNAS DE LA TABLA DUENOS)
export const update = async (id: number, datos: { telefono?: string; dni?: string }): Promise<void> => {
    await pool.query(
        'UPDATE duenos SET telefono = COALESCE(?, telefono), dni = COALESCE(?, dni) WHERE id = ?',
        [datos.telefono, datos.dni, id]
    );
};

// ELIMINAR DUENO
export const deleteById = async (id: number): Promise<void> => {
    await pool.query('DELETE FROM duenos WHERE id = ?', [id]);
};

// BUSCAR DUENO POR ID
export const findById = async (id: number): Promise<IDueno | null> => {
    const [rows] = await pool.query<IDueno[]>(
        `${BASE_SELECT} WHERE d.id = ?`,
        [id]
    );
    return rows.length ? rows[0] : null;
};
