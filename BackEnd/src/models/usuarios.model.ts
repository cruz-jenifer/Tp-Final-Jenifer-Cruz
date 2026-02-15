import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { pool } from '../config/database';
import { UserPayload } from '../types/auth.types'; 

// INTERFAZ INTERNA DE MODELO
export interface IUsuario extends RowDataPacket {
    id: number;
    email: string;
    password?: string;
    rol: string;
    creado_en?: Date;
}

// BUSCAR USUARIO POR EMAIL
export const findByEmail = async (email: string): Promise<IUsuario | null> => {
    const [rows] = await pool.query<IUsuario[]>(
        'SELECT * FROM usuarios WHERE email = ?',
        [email]
    );
    return rows.length ? rows[0] : null;
};

// BUSCAR USUARIO POR ID
export const findById = async (id: number): Promise<IUsuario | null> => {
    const [rows] = await pool.query<IUsuario[]>(
        'SELECT * FROM usuarios WHERE id = ?',
        [id]
    );
    return rows.length ? rows[0] : null;
};

// CREAR USUARIO
export const create = async (user: { email: string; password?: string; rol: string }): Promise<IUsuario> => {
    const [result] = await pool.execute<ResultSetHeader>(
        'INSERT INTO usuarios (email, password, rol) VALUES (?, ?, ?)',
        [user.email, user.password, user.rol]
    );
    return { id: result.insertId, email: user.email, rol: user.rol } as IUsuario;
};