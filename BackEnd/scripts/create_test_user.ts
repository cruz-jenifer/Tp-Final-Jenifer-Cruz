import { createPool } from 'mysql2/promise';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import path from 'path';

// Force load env from parent directory
dotenv.config({ path: path.join(__dirname, '../../.env') });

const createTestUser = async () => {
    console.log('--- DEBUG DB CONFIG ---');
    console.log('DB_HOST:', process.env.DB_HOST);
    console.log('DB_NAME:', process.env.DB_NAME);
    console.log('-----------------------');

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
        const email = `test_user_${Date.now()}@mail.com`;
        const password = 'user1234';
        const hashedPassword = await bcrypt.hash(password, 10);

        console.log('Creando usuario...');
        const [userResult]: any = await pool.execute(
            'INSERT INTO usuarios (email, password, rol) VALUES (?, ?, ?)',
            [email, hashedPassword, 'cliente']
        );
        const userId = userResult.insertId;

        console.log(`Usuario creado (ID: ${userId}). Creando perfil de dueño...`);
        const [duenoResult]: any = await pool.execute(
            'INSERT INTO duenos (usuario_id, nombre, apellido, telefono) VALUES (?, ?, ?, ?)',
            [userId, 'Test', 'User', '555-5555']
        );
        const duenoId = duenoResult.insertId;

        console.log(`Dueño creado (ID: ${duenoId}). Agregando mascotas...`);

        // Add Dog 1
        await pool.execute(
            'INSERT INTO mascotas (nombre, especie, raza, fecha_nacimiento, dueno_id) VALUES (?, ?, ?, ?, ?)',
            ['Buddy', 'Perro', 'Golden Retriever', '2020-05-15', duenoId]
        );

        // Add Dog 2
        await pool.execute(
            'INSERT INTO mascotas (nombre, especie, raza, fecha_nacimiento, dueno_id) VALUES (?, ?, ?, ?, ?)',
            ['Luna', 'Perro', 'Labrador', '2021-08-20', duenoId]
        );

        console.log('\n✅ USUARIO DE PRUEBA CREADO CON ÉXITO');
        console.log('----------------------------------------');
        console.log(`Email:    ${email}`);
        console.log(`Password: ${password}`);
        console.log('Mascotas: Buddy (Perro), Luna (Perro)');
        console.log('----------------------------------------');

    } catch (error) {
        console.error('❌ Error al crear usuario:', error);
    } finally {
        await pool.end();
    }
};

createTestUser();
