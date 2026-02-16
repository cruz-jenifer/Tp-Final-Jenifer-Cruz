import { createPool } from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';

// Force load env from parent directory
dotenv.config({ path: path.join(__dirname, '../../.env') });

const verifyUser = async () => {
    const pool = createPool({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'veterinaria_patitas_felices',
        port: Number(process.env.DB_PORT) || 3306,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    });

    try {
        const email = 'test_user_1771177823410@mail.com';
        console.log(`Verificando usuario: ${email}`);

        const [rows]: any = await pool.execute(
            'SELECT * FROM usuarios WHERE email = ?',
            [email]
        );

        if (rows.length === 0) {
            console.log('❌ Usuario NO encontrado en la base de datos.');
        } else {
            console.log('✅ Usuario encontrado:', rows[0]);
            console.log('Hash almacenado:', rows[0].password);
        }

    } catch (error) {
        console.error('❌ Error al consultar usuario:', error);
    } finally {
        await pool.end();
    }
};

verifyUser();
