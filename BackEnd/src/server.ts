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

        // LEVANTAR EL SERVIDOR
        app.listen(PORT, () => {
            console.log(`SERVIDOR ACTIVO | PUERTO: ${PORT} | ENTORNO: ${process.env.NODE_ENV}`);
        });
    } catch (error) {
        console.error('ERROR CRITICO AL INICIAR EL SERVIDOR:', error);
        process.exit(1);
    }
};

startServer();