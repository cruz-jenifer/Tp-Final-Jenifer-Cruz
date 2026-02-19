import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { pool } from '../config/database';
import { EstadoTurno } from '../types/enums';

// INTERFAZ TURNO
export interface Turno extends RowDataPacket {
    id: number;
    mascota_id: number;
    veterinario_id: number;
    servicio_id: number;
    fecha: string;
    hora: string;
    motivo_consulta: string;
    estado: EstadoTurno;
    created_at: string;
}

// INTERFAZ TURNO CON DETALLE (JOINS)
export interface TurnoDetalle extends Turno {
    mascota?: string;
    mascota_especie?: string;
    servicio?: string;
    veterinario_nombre?: string;
    veterinario_apellido?: string;
    dueno_nombre?: string;
    dueno_apellido?: string;
}

export interface CreateTurnoDto {
    mascota_id: number;
    veterinario_id: number;
    servicio_id: number;
    fecha: string;
    hora: string;
    motivo_consulta: string;
}

// QUERY BASE CON JOINS (REUTILIZABLE)
const BASE_DETAIL_SELECT = `
    SELECT 
        t.id, 
        t.fecha, 
        t.hora,
        t.estado,
        t.motivo_consulta,
        t.mascota_id,
        t.servicio_id,
        t.veterinario_id,
        t.created_at,
        m.nombre as mascota, 
        e.nombre as mascota_especie,
        ud.nombre as dueno_nombre, 
        ud.apellido as dueno_apellido,
        ts.nombre as servicio,
        uv.nombre as veterinario_nombre,
        uv.apellido as veterinario_apellido
    FROM turnos t
    JOIN mascotas m ON t.mascota_id = m.id
    JOIN razas r ON m.raza_id = r.id
    JOIN especies e ON r.especie_id = e.id
    JOIN duenos d ON m.dueno_id = d.id
    JOIN usuarios ud ON d.usuario_id = ud.id
    JOIN tipos_servicios ts ON t.servicio_id = ts.id
    JOIN veterinarios v ON t.veterinario_id = v.id
    JOIN usuarios uv ON v.usuario_id = uv.id
`;

export class TurnoModel {

    // VALIDAR DISPONIBILIDAD
    static async validarDisponibilidad(veterinarioId: number, fecha: string, hora: string): Promise<boolean> {
        const [rows] = await pool.query<RowDataPacket[]>(
            'SELECT COUNT(*) as count FROM turnos WHERE veterinario_id = ? AND fecha = ? AND hora = ?',
            [veterinarioId, fecha, hora]
        );
        return rows[0].count === 0;
    }

    // CREAR TURNO
    static async create(turno: CreateTurnoDto): Promise<number> {
        const [result] = await pool.query<ResultSetHeader>(
            'INSERT INTO turnos (mascota_id, veterinario_id, servicio_id, fecha, hora, motivo_consulta, estado) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [
                turno.mascota_id,
                turno.veterinario_id,
                turno.servicio_id,
                turno.fecha,
                turno.hora,
                turno.motivo_consulta,
                EstadoTurno.PENDIENTE
            ]
        );
        return result.insertId;
    }

    // BUSCAR POR DUENO
    static async findAllByDuenoId(duenoId: number): Promise<TurnoDetalle[]> {
        const query = `
            ${BASE_DETAIL_SELECT}
            WHERE m.dueno_id = ?
            ORDER BY 
                CASE 
                    WHEN t.estado = ? THEN 1 
                    ELSE 0 
                END ASC,
                t.fecha ASC, t.hora ASC
        `;
        const [rows] = await pool.query<TurnoDetalle[]>(query, [duenoId, EstadoTurno.CANCELADO]);
        return rows;
    }

    // BUSCAR POR FECHA
    static async findAllByFecha(fecha: string): Promise<TurnoDetalle[]> {
        const query = `
            ${BASE_DETAIL_SELECT}
            WHERE t.fecha = ?
            ORDER BY t.hora ASC
        `;
        const [rows] = await pool.query<TurnoDetalle[]>(query, [fecha]);
        return rows;
    }

    // BUSCAR TURNOS FUTUROS
    static async findAllFuture(): Promise<TurnoDetalle[]> {
        const query = `
            ${BASE_DETAIL_SELECT}
            WHERE t.fecha >= CURDATE()
            ORDER BY t.fecha ASC, t.hora ASC
        `;
        const [rows] = await pool.query<TurnoDetalle[]>(query);
        return rows;
    }

    // BUSCAR TODOS LOS TURNOS
    static async findAll(): Promise<TurnoDetalle[]> {
        const query = `
            ${BASE_DETAIL_SELECT}
            ORDER BY t.fecha DESC, t.hora DESC
        `;
        const [rows] = await pool.query<TurnoDetalle[]>(query);
        return rows;
    }

    // BUSCAR POR VETERINARIO Y FECHA
    static async findAllByVeterinarioIdAndFecha(veterinarioId: number, fecha: string): Promise<TurnoDetalle[]> {
        const query = `
            ${BASE_DETAIL_SELECT}
            WHERE t.veterinario_id = ? AND t.fecha = ?
            ORDER BY t.hora ASC
        `;
        const [rows] = await pool.query<TurnoDetalle[]>(query, [veterinarioId, fecha]);
        return rows;
    }

    // ACTUALIZAR ESTADO
    static async updateStatus(id: number, estado: EstadoTurno): Promise<void> {
        await pool.query(
            'UPDATE turnos SET estado = ? WHERE id = ?',
            [estado, id]
        );
    }

    // ELIMINAR TURNO
    static async delete(id: number): Promise<void> {
        await pool.query('DELETE FROM turnos WHERE id = ?', [id]);
    }

    // BUSCAR POR ID
    static async findById(id: number): Promise<Turno | null> {
        const [rows] = await pool.query<Turno[]>(
            'SELECT * FROM turnos WHERE id = ?',
            [id]
        );
        if (rows.length === 0) return null;
        return rows[0];
    }

    // BUSCAR POR ID CON DETALLE
    static async findByIdDetalle(id: number): Promise<TurnoDetalle | null> {
        const query = `${BASE_DETAIL_SELECT} WHERE t.id = ?`;
        const [rows] = await pool.query<TurnoDetalle[]>(query, [id]);
        if (rows.length === 0) return null;
        return rows[0];
    }

    // ACTUALIZAR TURNO
    static async update(id: number, datos: Partial<CreateTurnoDto>): Promise<void> {
        await pool.query(
            `UPDATE turnos SET 
                fecha = COALESCE(?, fecha), 
                hora = COALESCE(?, hora),
                veterinario_id = COALESCE(?, veterinario_id), 
                servicio_id = COALESCE(?, servicio_id),
                mascota_id = COALESCE(?, mascota_id),
                motivo_consulta = COALESCE(?, motivo_consulta) 
             WHERE id = ?`,
            [datos.fecha, datos.hora, datos.veterinario_id, datos.servicio_id, datos.mascota_id, datos.motivo_consulta, id]
        );
    }
}
