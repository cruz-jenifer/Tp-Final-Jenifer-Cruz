import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { pool } from '../config/database';
import { RolNombre, RolId } from '../types/enums';

export interface User extends RowDataPacket {
    id: number;
    rol_id: number;
    email: string;
    password_hash: string;
    nombre: string;
    apellido: string;
    fecha_registro?: Date;
    rol_nombre?: RolNombre; // JOIN CON ROLES
}

export interface CreateUserDto {
    email: string;
    password_hash: string;
    nombre: string;
    apellido: string;
    rol_id: number;
}

// BUSCAR POR EMAIL (CON ROL)
export const findByEmail = async (email: string): Promise<User | null> => {
    const [rows] = await pool.query<User[]>(
        `SELECT u.*, r.nombre as rol_nombre 
         FROM usuarios u 
         JOIN roles r ON u.rol_id = r.id 
         WHERE u.email = ?`,
        [email]
    );
    return rows.length ? rows[0] : null;
};

// BUSCAR POR ID (CON ROL)
export const findById = async (id: number): Promise<User | null> => {
    const [rows] = await pool.query<User[]>(
        `SELECT u.*, r.nombre as rol_nombre 
         FROM usuarios u 
         JOIN roles r ON u.rol_id = r.id 
         WHERE u.id = ?`,
        [id]
    );
    return rows.length ? rows[0] : null;
};

// CREAR USUARIO
export const create = async (user: CreateUserDto): Promise<number> => {
    const [result] = await pool.execute<ResultSetHeader>(
        'INSERT INTO usuarios (email, password_hash, nombre, apellido, rol_id) VALUES (?, ?, ?, ?, ?)',
        [user.email, user.password_hash, user.nombre, user.apellido, user.rol_id]
    );
    return result.insertId;
};

// ELIMINAR USUARIO
export const deleteById = async (id: number): Promise<void> => {
    await pool.query('DELETE FROM usuarios WHERE id = ?', [id]);
};

// OBTENER ROL_ID POR NOMBRE (CASE-INSENSITIVE)
export const getRolIdByNombre = async (nombre: string): Promise<number | null> => {
    const [rows] = await pool.query<RowDataPacket[]>(
        'SELECT id FROM roles WHERE LOWER(nombre) = LOWER(?)',
        [nombre.trim()]
    );
    if (!rows.length) return null;

    // VALIDACION ADICIONAL CON ENUM (OPCIONAL PERO RECOMENDADO)
    const id = rows[0].id;
    return id as RolId;
};

// ACTUALIZAR NOMBRE Y APELLIDO
export const updateNombreApellido = async (id: number, nombre: string, apellido: string): Promise<void> => {
    await pool.query(
        'UPDATE usuarios SET nombre = ?, apellido = ? WHERE id = ?',
        [nombre, apellido, id]
    );
};
