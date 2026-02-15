import app from './app';
import { connectDB } from './config/database';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        // CONECTAR A BASE DE DATOS PRIMERO
        await connectDB();

        // LEVANTAR EL SERVIDOR
        app.listen(PORT, () => {
            console.log(`🚀Servidor corriendo en el puerto ${PORT}`);
            console.log(`⭐️Entorno: ${process.env.NODE_ENV}`);
        });
    } catch (error) {
        console.error('Error al iniciar el servidor:', error);
    }
};

startServer();