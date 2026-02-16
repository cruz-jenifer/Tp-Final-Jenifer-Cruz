import { RowDataPacket } from 'mysql2';
import { pool } from '../config/database';

export interface IVeterinario {
    id?: number;
    usuario_id: number;
    nombre: string;
    apellido: string;
    matricula: string;
}

export class VeterinarioModel {

    // BUSCAR PERFIL POR ID DE USUARIO
    static async findByUserId(usuarioId: number): Promise<IVeterinario | null> {
        const [rows] = await pool.query<RowDataPacket[]>(
            'SELECT * FROM veterinarios WHERE usuario_id = ?',
            [usuarioId]
        );

        if (rows.length === 0) return null;

        return rows[0] as IVeterinario;
    }

    // BUSCAR POR ID DE VETERINARIO
    static async findById(id: number): Promise<IVeterinario | null> {
        const [rows] = await pool.query<RowDataPacket[]>(
            'SELECT * FROM veterinarios WHERE id = ?',
            [id]
        );

        if (rows.length === 0) return null;

        return rows[0] as IVeterinario;
    }

    // LISTAR TODOS LOS VETERINARIOS
    static async findAll(): Promise<IVeterinario[]> {
        const [rows] = await pool.query<RowDataPacket[]>(
            'SELECT id, nombre, apellido, matricula FROM veterinarios ORDER BY apellido, nombre'
        );

        return rows as IVeterinario[];
    }
}