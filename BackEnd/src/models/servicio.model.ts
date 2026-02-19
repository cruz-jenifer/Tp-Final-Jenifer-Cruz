import { pool } from '../config/database';
import { RowDataPacket } from 'mysql2';
import { Servicio } from '../types/servicio';

export class ServicioModel {

    // OBTENER TODOS LOS SERVICIOS
    static async findAll(): Promise<Servicio[]> {
        const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM tipos_servicios');
        return rows as Servicio[];
    }

    // OBTENER SERVICIO POR ID
    static async findById(id: number): Promise<Servicio | null> {
        const [rows] = await pool.query<RowDataPacket[]>(
            'SELECT * FROM tipos_servicios WHERE id = ?',
            [id]
        );
        return rows.length ? (rows[0] as Servicio) : null;
    }
}