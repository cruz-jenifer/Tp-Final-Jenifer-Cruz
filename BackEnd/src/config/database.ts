import { createPool } from 'mysql2/promise'; 
import dotenv from 'dotenv';

dotenv.config();

// CONFIGURACION DEL POOL DE CONEXIONES
export const pool = createPool({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306, 
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'veterinaria_patitas_felices',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export const connectDB = async () => {
    try {
        const connection = await pool.getConnection();
        console.log('🚀 CONEXIÓN A MYSQL EXITOSA');
        connection.release();
    } catch (error) {
        console.error('❌ ERROR AL CONECTAR A LA BASE DE DATOS:', error);
        process.exit(1);
    }
};