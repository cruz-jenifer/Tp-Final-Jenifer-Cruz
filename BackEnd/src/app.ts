import express from 'express';
import cors from 'cors';
import routes from './routes';
import { errorMiddleware } from './middlewares/error.middleware';

const app = express();

// CONFIGURACION CORS
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-token']
}));

app.use(express.json());

// RUTAS
app.use('/api', routes);

// MIDDLEWARE DE ERRORES
app.use(errorMiddleware);

export default app;

