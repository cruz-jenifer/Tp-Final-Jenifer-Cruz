import { ResultSetHeader } from 'mysql2';
import { pool } from '../config/database';
import { Veterinario, VeterinarioResponse } from '../types/veterinarios';

// QUERY BASE CON JOIN USUARIOS
const BASE_SELECT = `
    SELECT v.id, v.usuario_id, v.matricula,
           u.nombre, u.apellido, u.email
    FROM veterinarios v
    JOIN usuarios u ON v.usuario_id = u.id
`;

// BUSCAR POR ID DE USUARIO
export const findByUserId = async (usuarioId: number): Promise<VeterinarioResponse | null> => {
    const [rows] = await pool.query<VeterinarioResponse[]>(
        `${BASE_SELECT} WHERE v.usuario_id = ?`,
        [usuarioId]
    );
    return rows.length ? rows[0] : null;
};

// BUSCAR POR ID
export const findById = async (id: number): Promise<VeterinarioResponse | null> => {
    const [rows] = await pool.query<VeterinarioResponse[]>(
        `${BASE_SELECT} WHERE v.id = ?`,
        [id]
    );
    return rows.length ? rows[0] : null;
};

// LISTAR TODOS LOS VETERINARIOS
export const findAll = async (): Promise<VeterinarioResponse[]> => {
    const [rows] = await pool.query<VeterinarioResponse[]>(
        `${BASE_SELECT} ORDER BY u.apellido, u.nombre`
    );
    return rows;
};

// CREAR VETERINARIO (SOLO COLUMNAS DE LA TABLA)
export const create = async (usuario_id: number, matricula: string): Promise<number> => {
    const [result] = await pool.execute<ResultSetHeader>(
        'INSERT INTO veterinarios (usuario_id, matricula) VALUES (?, ?)',
        [usuario_id, matricula]
    );
    return result.insertId;
};

// ACTUALIZAR VETERINARIO
export const update = async (id: number, matricula: string): Promise<void> => {
    await pool.query(
        'UPDATE veterinarios SET matricula = ? WHERE id = ?',
        [matricula, id]
    );
};

// ELIMINAR VETERINARIO
export const deleteById = async (id: number): Promise<void> => {
    await pool.query('DELETE FROM veterinarios WHERE id = ?', [id]);
};
