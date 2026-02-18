import express from 'express';
import cors from 'cors';
import routes from './routes';
import { errorMiddleware } from './middlewares/error.middleware';

const app = express();

// CONFIGURACION CORS
app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// RUTAS
app.use('/api', routes);

// MIDDLEWARE DE ERRORES
app.use(errorMiddleware);

export default app;

