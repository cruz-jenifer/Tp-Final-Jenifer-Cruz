import express from 'express';
import cors from 'cors';
import routes from './routes';
import { errorMiddleware } from './middlewares/error.middleware';

const app = express();

// Configuración de CORS 
// Esto permite que el Front pueda hacer peticiones sin ser bloqueado
app.use(cors({
    origin: process.env.CORS_ORIGIN || '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Rutas base
app.use('/api', routes);

// Middleware de errores (Siempre al final)
app.use(errorMiddleware);

export default app;