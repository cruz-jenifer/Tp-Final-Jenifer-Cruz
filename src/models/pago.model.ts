import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { pool } from '../config/database';

export interface IPago {
    id?: number;
    turno_id: number;
    monto: number;
    metodo: 'mercadopago' | 'tarjeta' | 'efectivo';
    estado?: 'pendiente' | 'completado' | 'rechazado';
    creado_en?: Date;
}

export class PagoModel {

    // CREAR PAGO
    static async create(pago: IPago): Promise<number> {
        const [result] = await pool.query<ResultSetHeader>(
            'INSERT INTO pagos (turno_id, monto, metodo, estado) VALUES (?, ?, ?, ?)',
            [
                pago.turno_id,
                pago.monto,
                pago.metodo,
                pago.estado || 'pendiente'
            ]
        );
        return result.insertId;
    }

    // BUSCAR POR TURNO
    static async findByTurnoId(turnoId: number): Promise<IPago | null> {
        const [rows] = await pool.query<RowDataPacket[]>(
            'SELECT * FROM pagos WHERE turno_id = ?',
            [turnoId]
        );

        if (rows.length === 0) return null;
        return rows[0] as IPago;
    }

    // BUSCAR TODOS
    static async findAll(): Promise<IPago[]> {
        const [rows] = await pool.query<RowDataPacket[]>(
            'SELECT * FROM pagos ORDER BY creado_en DESC'
        );
        return rows as IPago[];
    }
}
