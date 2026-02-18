import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { pool } from '../config/database';
import { IMascota } from './interfaces/mascota.interface';

// BUSCAR MASCOTA POR ID

export const findById = async (id: number) => {
    const [rows] = await pool.query<RowDataPacket[]>(
        'SELECT * FROM mascotas WHERE id = ?',
        [id]
    );
    return rows.length > 0 ? rows[0] as IMascota : null;
};

// BUSCAR TODAS LAS MASCOTAS
export const findAll = async (): Promise<any[]> => {
    const query = `
        SELECT m.*, d.nombre as dueno_nombre, d.apellido as dueno_apellido 
        FROM mascotas m
        LEFT JOIN duenos d ON m.dueno_id = d.id
    `;
    const [rows] = await pool.query<RowDataPacket[]>(query);
    return rows;
};

// BUSCAR MASCOTAS POR DUENO
export const findByDuenoId = async (duenoId: number): Promise<IMascota[]> => {
    const [rows] = await pool.query<IMascota[]>(
        'SELECT * FROM mascotas WHERE dueno_id = ?',
        [duenoId]
    );
    return rows;
};

// CREAR MASCOTA
export const create = async (mascota: Omit<IMascota, 'id'>): Promise<IMascota> => {
    const [result] = await pool.execute<ResultSetHeader>(
        'INSERT INTO mascotas (nombre, especie, raza, fecha_nacimiento, advertencias, dueno_id) VALUES (?, ?, ?, ?, ?, ?)',
        [
            mascota.nombre || null,
            mascota.especie || null,
            mascota.raza || null,
            mascota.fecha_nacimiento || null,
            mascota.advertencias || null,
            mascota.dueno_id
        ]
    );
    return { id: result.insertId, ...mascota } as IMascota;
};

// ELIMINAR MASCOTA
export const deleteById = async (id: number): Promise<void> => {
    await pool.query('DELETE FROM mascotas WHERE id = ?', [id]);
};

// ACTUALIZAR MASCOTA
export const update = async (id: number, mascota: Partial<IMascota>): Promise<void> => {
    await pool.query(
        'UPDATE mascotas SET nombre = ?, especie = ?, raza = ?, fecha_nacimiento = ?, advertencias = ? WHERE id = ?',
        [
            mascota.nombre,
            mascota.especie,
            mascota.raza,
            mascota.fecha_nacimiento,
            mascota.advertencias,
            id
        ]
    );
};