import { RowDataPacket } from 'mysql2';
import { pool } from '../config/database';

export interface IVeterinario {
    id?: number;
    usuario_id: number;
    nombre: string;
    apellido: string;
    matricula: string;
    email?: string;
    clave_temporal?: string;
}

export class VeterinarioModel {

    // BUSCAR POR ID DE USUARIO
    static async findByUserId(usuarioId: number): Promise<IVeterinario | null> {
        const [rows] = await pool.query<RowDataPacket[]>(
            'SELECT * FROM veterinarios WHERE usuario_id = ?',
            [usuarioId]
        );

        if (rows.length === 0) return null;

        return rows[0] as IVeterinario;
    }

    // BUSCAR POR ID
    static async findById(id: number): Promise<IVeterinario | null> {
        const [rows] = await pool.query<RowDataPacket[]>(
            'SELECT v.*, u.email FROM veterinarios v LEFT JOIN usuarios u ON v.usuario_id = u.id WHERE v.id = ?',
            [id]
        );

        if (rows.length === 0) return null;

        return rows[0] as IVeterinario;
    }

    // LISTAR TODOS LOS VETERINARIOS
    static async findAll(): Promise<IVeterinario[]> {
        try {
            const [rows] = await pool.query<RowDataPacket[]>(
                'SELECT v.id, v.nombre, v.apellido, v.matricula, v.clave_temporal, u.email FROM veterinarios v LEFT JOIN usuarios u ON v.usuario_id = u.id ORDER BY v.apellido, v.nombre'
            );
            return rows as IVeterinario[];
        } catch (error: any) {
            // MIGRACION AUTOMATICA
            if (error.errno === 1054 || error.code === 'ER_BAD_FIELD_ERROR') {
                console.log('MIGRACION: AGREGANDO COLUMNA CLAVE_TEMPORAL');
                await pool.query('ALTER TABLE veterinarios ADD COLUMN clave_temporal VARCHAR(255) DEFAULT NULL;');
                // REINTENTAR
                const [rows] = await pool.query<RowDataPacket[]>(
                    'SELECT v.id, v.nombre, v.apellido, v.matricula, v.clave_temporal, u.email FROM veterinarios v LEFT JOIN usuarios u ON v.usuario_id = u.id ORDER BY v.apellido, v.nombre'
                );
                return rows as IVeterinario[];
            }
            throw error;
        }
    }

    // CREAR VETERINARIO
    static async create(data: { usuario_id: number; nombre: string; apellido: string; matricula: string; clave_temporal?: string }): Promise<IVeterinario> {
        const [result] = await pool.query<any>(
            'INSERT INTO veterinarios (usuario_id, nombre, apellido, matricula, clave_temporal) VALUES (?, ?, ?, ?, ?)',
            [data.usuario_id, data.nombre, data.apellido, data.matricula, data.clave_temporal || null]
        );

        return { id: result.insertId, ...data };
    }

    // ACTUALIZAR VETERINARIO
    static async update(id: number, data: Partial<IVeterinario>): Promise<void> {
        await pool.query(
            'UPDATE veterinarios SET ? WHERE id = ?',
            [data, id]
        );
    }

    // ELIMINAR VETERINARIO
    static async deleteById(id: number): Promise<void> {
        await pool.query('DELETE FROM veterinarios WHERE id = ?', [id]);
    }
}