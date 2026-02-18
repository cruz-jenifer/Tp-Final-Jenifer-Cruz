import app from './app';
import { connectDB } from './config/database';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.join(__dirname, '../.env') });

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        // CONECTAR A BASE DE DATOS PRIMERO
        await connectDB();

        // MIGRACION AUTOMATICA
        try {
            const { pool } = await import('./config/database');
            await pool.query('ALTER TABLE veterinarios ADD COLUMN clave_temporal VARCHAR(255) DEFAULT NULL;');
            console.log('✅ MIGRACION EXITOSA: Columna clave_temporal agregada.');
        } catch (error: any) {
            if (error.code === 'ER_DUP_FIELDNAME') {
                console.log('ℹ️ ESQUEMA CORRECTO: La columna clave_temporal ya existe.');
            } else {
                console.error('⚠️ ERROR DE MIGRACION:', error.message);
            }
        }

        // LEVANTAR EL SERVIDOR
        app.listen(PORT, () => {
            console.log(`🚀Servidor corriendo en el puerto ${PORT}`);
            console.log(`⭐️Entorno: ${process.env.NODE_ENV}`);
        });
    } catch (error) {
        console.error('ERROR AL INICIAR EL SERVIDOR:', error);
    }
};

startServer();