import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { pool } from '../config/database';

// INTERFAZ MASCOTA
export interface Mascota extends RowDataPacket {
    id: number;
    dueno_id: number;
    raza_id: number;
    nombre: string;
    fecha_nacimiento: string;
    created_at: string;
    raza?: string;
    especie?: string;
    dueno_nombre?: string;
    dueno_apellido?: string;
}

export interface MascotaCrearDto {
    dueno_id: number;
    raza_id: number;
    nombre: string;
    fecha_nacimiento: string;
}

// CONFIGURACIÓN DE CONSULTAS
const CONSULTA_BASE = `
    SELECT 
        m.id,
        m.dueno_id,
        m.raza_id,
        m.nombre,
        m.fecha_nacimiento,
        m.created_at,
        r.nombre as raza,
        e.nombre as especie,
        u.nombre as dueno_nombre,
        u.apellido as dueno_apellido
    FROM mascotas m
    JOIN razas r ON m.raza_id = r.id
    JOIN especies e ON r.especie_id = e.id
    JOIN duenos d ON m.dueno_id = d.id
    JOIN usuarios u ON d.usuario_id = u.id
`;

// OPERACIONES DE BASE DE DATOS
export const buscarPorId = async (id: number): Promise<Mascota | null> => {
    const [filas] = await pool.query<Mascota[]>(
        `${CONSULTA_BASE} WHERE m.id = ?`,
        [id]
    );
    return filas.length > 0 ? filas[0] : null;
};

// ALIAS PARA COMPATIBILIDAD
export const findById = buscarPorId;

export const buscarTodos = async (): Promise<Mascota[]> => {
    const [filas] = await pool.query<Mascota[]>(CONSULTA_BASE);
    return filas;
};

export const buscarPorDuenoId = async (duenoId: number): Promise<Mascota[]> => {
    const [filas] = await pool.query<Mascota[]>(
        `${CONSULTA_BASE} WHERE m.dueno_id = ?`,
        [duenoId]
    );
    return filas;
};

export const crear = async (mascota: MascotaCrearDto): Promise<number> => {
    const [resultado] = await pool.execute<ResultSetHeader>(`
        INSERT INTO mascotas (dueno_id, raza_id, nombre, fecha_nacimiento) 
        VALUES (?, ?, ?, ?)
    `, [mascota.dueno_id, mascota.raza_id, mascota.nombre, mascota.fecha_nacimiento]);
    return resultado.insertId;
};

export const eliminarPorId = async (id: number): Promise<void> => {
    await pool.query('DELETE FROM mascotas WHERE id = ?', [id]);
};

export const actualizar = async (id: number, mascota: Partial<MascotaCrearDto>): Promise<void> => {
    const campos: string[] = [];
    const valores: (string | number)[] = [];

    if (mascota.nombre) { campos.push('nombre = ?'); valores.push(mascota.nombre); }
    if (mascota.raza_id) { campos.push('raza_id = ?'); valores.push(mascota.raza_id); }
    if (mascota.fecha_nacimiento) { campos.push('fecha_nacimiento = ?'); valores.push(mascota.fecha_nacimiento); }

    if (campos.length === 0) return;

    valores.push(id);
    await pool.query(
        `UPDATE mascotas SET ${campos.join(', ')} WHERE id = ?`,
        valores
    );
};