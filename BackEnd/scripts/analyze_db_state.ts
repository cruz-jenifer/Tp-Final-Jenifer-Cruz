
import { pool } from '../src/config/database';

async function analyzeDb() {
    try {
        console.log('--- USERS ---');
        const [users] = await pool.query('SELECT * FROM usuarios');
        console.table(users);

        console.log('--- VETS ---');
        const [vets] = await pool.query('SELECT * FROM veterinarios');
        console.table(vets);

        console.log('--- OWNERS ---');
        const [owners] = await pool.query('SELECT * FROM duenos');
        console.table(owners);

        console.log('--- PETS ---');
        const [pets] = await pool.query('SELECT * FROM mascotas');
        console.table(pets);

        console.log('--- TURNOS ---');
        const [turnos] = await pool.query('SELECT * FROM turnos');
        console.table(turnos);

    } catch (e) {
        console.error(e);
    }
    process.exit();
}

analyzeDb();
