import { createPool } from 'mysql2/promise';
import path from 'path';
import dotenv from 'dotenv';

// CARGA DE VARIABLES DE ENTORNO
dotenv.config({ path: path.join(__dirname, '../../../.env') });
// RESPALDO DE VARIABLES DE ENTORNO
if (!process.env.DB_NAME) {
    dotenv.config({ path: path.join(__dirname, '../../.env') });
}

// CONFIGURACION DEL POOL DE CONEXIONES
export const pool = createPool({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_NAME || 'veterinaria',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    dateStrings: true,
    namedPlaceholders: true
});

// CONEXION INICIAL A LA BASE DE DATOS
export const connectDB = async () => {
    try {
        const connection = await pool.getConnection();
        console.log('SISTEMA DE BASE DE DATOS INICIALIZADO');
        connection.release();
    } catch (error) {
        console.error('ERROR FATAL AL CONECTAR A LA BASE DE DATOS:', error);
        process.exit(1);
    }
};