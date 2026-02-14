import { PagoModel, IPago } from '../models/pago.model';
import { TurnoModel } from '../models/turno.model';
import { pool } from '../config/database';
import { RowDataPacket } from 'mysql2';

export class PagoService {

    // PROCESAR PAGO
    static async procesarPago(data: IPago, userId: number) {

        // OBTENER DATOS
        const [turnos] = await pool.query<RowDataPacket[]>(
            `SELECT t.*, m.dueno_id, d.usuario_id 
             FROM turnos t
             JOIN mascotas m ON t.mascota_id = m.id
             JOIN duenos d ON m.dueno_id = d.id
             WHERE t.id = ?`,
            [data.turno_id]
        );

        if (turnos.length === 0) {
            throw new Error('El turno indicado no existe');
        }

        const turno = turnos[0];

        // VALIDAR PERMISO
        if (turno.usuario_id !== userId) {
            throw new Error('No tienes permiso para pagar este turno');
        }

        // VALIDAR ESTADO
        if (turno.estado !== 'pendiente') {
            throw new Error('El turno no está pendiente de pago');
        }

        // REGISTRAR PAGO
        const nuevoPago: IPago = {
            ...data,
            estado: 'completado'
        };

        const pagoId = await PagoModel.create(nuevoPago);

        // ACTUALIZAR ESTADO
        await pool.query(
            'UPDATE turnos SET estado = ? WHERE id = ?',
            ['confirmado', data.turno_id]
        );

        return {
            pago_id: pagoId,
            mensaje: 'Pago procesado exitosamente. Turno confirmado.',
            estado_turno: 'confirmado'
        };
    }

    // LISTAR PAGOS
    static async obtenerMisPagos(userId: number) {
        // BUSCAR PAGOS
        const query = `
            SELECT p.*, t.fecha_hora as fecha_turno, s.nombre as servicio
            FROM pagos p
            JOIN turnos t ON p.turno_id = t.id
            JOIN servicios s ON t.servicio_id = s.id
            JOIN mascotas m ON t.mascota_id = m.id
            JOIN duenos d ON m.dueno_id = d.id
            WHERE d.usuario_id = ?
            ORDER BY p.creado_en DESC
        `;

        const [rows] = await pool.query<RowDataPacket[]>(query, [userId]);
        return rows;
    }
}
