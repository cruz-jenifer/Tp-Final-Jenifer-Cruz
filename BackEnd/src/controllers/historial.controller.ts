import { Request, Response, NextFunction } from 'express';
import { RowDataPacket } from 'mysql2';
import { pool } from '../config/database';
import { HistorialModel } from '../models/historial.model';

// CREAR NUEVA ENTRADA
export const createHistorial = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) throw new Error('NO AUTORIZADO');

        const { mascota_id, diagnostico, tratamiento, fecha } = req.body;

        if (!mascota_id || !diagnostico || !fecha) {
            return res.status(400).json({ message: 'FALTAN DATOS OBLIGATORIOS' });
        }

        // VALIDAR VETERINARIO
        const [vetRows] = await pool.query<RowDataPacket[]>(
            'SELECT id FROM veterinarios WHERE usuario_id = ?',
            [req.user.id]
        );

        // NOTA: ADMIN TIENE PERMISO EN RUTAS, PERO SI NO ESTA EN TABLA VETERINARIOS
        // NECESITAMOS UNA LOGICA DE FALLBACK O ERROR. 
        // ASUMIMOS QUE ADMIN PUEDE ESCRIBIR SI TIENE PERFIL ASOCIADO O FORZAMOS ID 1 (SISTEMA)
        let veterinarioId: number;

        if (vetRows.length > 0) {
            veterinarioId = vetRows[0].id;
        } else if (req.user.rol === 'admin') {
            veterinarioId = 1; // ID DE SISTEMA
        } else {
            return res.status(403).json({ message: 'NO TIENES PERFIL PROFESIONAL PARA FIRMAR HISTORIAL' });
        }

        const nuevoRegistro = await HistorialModel.create({
            mascota_id,
            veterinario_id: veterinarioId,
            fecha,
            diagnostico,
            tratamiento
        });

        res.status(201).json({ message: 'HISTORIAL ACTUALIZADO', data: nuevoRegistro });

    } catch (error) {
        next(error);
    }
};

// OBTENER HISTORIAL (PROTEGIDO)
export const getHistorialByMascota = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) throw new Error('NO AUTORIZADO');

        const { id } = req.params;
        const mascotaId = Number(id);

        // VALIDACION DE PROPIEDAD
        if (req.user.rol === 'cliente') {
            const [rows] = await pool.query<RowDataPacket[]>(
                `SELECT m.id 
                 FROM mascotas m 
                 INNER JOIN duenos d ON m.dueno_id = d.id 
                 WHERE m.id = ? AND d.usuario_id = ?`,
                [mascotaId, req.user.id]
            );

            if (rows.length === 0) {
                return res.status(403).json({ message: 'NO ESTAS AUTORIZADO A VER ESTA HISTORIA CLINICA' });
            }
        }

        // OBTENER DATOS
        const historial = await HistorialModel.findByMascotaId(mascotaId);
        res.json({ data: historial });
    } catch (error) {
        next(error);
    }
};