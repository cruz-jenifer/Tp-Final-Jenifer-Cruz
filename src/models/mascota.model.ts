import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { pool } from '../config/database';
import { IMascota } from './interfaces/mascota.interface';

// BUSCAR MASCOTA POR ID

export const findById = async (id: number) => {
    const [rows] = await pool.query<RowDataPacket[]>(
        'SELECT * FROM mascotas WHERE id = ?',
        [id]
    );
    return rows.length > 0 ? rows[0] : null;
};

// BUSCAR MASCOTAS POR DUENO
export const findByDuenoId = async (duenoId: number): Promise<IMascota[]> => {
    const [rows] = await pool.query<IMascota[]>(
        'SELECT * FROM mascotas WHERE dueno_id = ?',
        [duenoId]
    );
    return rows;
};

// CREAR NUEVA MASCOTA
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