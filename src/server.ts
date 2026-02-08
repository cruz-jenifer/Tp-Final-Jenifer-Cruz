import app from './app';
import { connectDB } from './config/database'; 
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        //  Conectar a Base de Datos primero
        await connectDB();
        
        //  Levantar el servidor
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
            console.log(`⭐️ Environment: ${process.env.NODE_ENV}`);
        });
    } catch (error) {
        console.error('Error al iniciar el servidor:', error);
    }
};

startServer();