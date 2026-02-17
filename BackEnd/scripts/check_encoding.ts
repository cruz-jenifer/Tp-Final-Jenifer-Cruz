
import { pool } from '../src/config/database';

async function checkEncoding() {
    try {
        const [rows] = await pool.query('SELECT * FROM servicios_veterinaria LIMIT 5');
        console.log('Servicios:', rows);

        const [vets] = await pool.query('SELECT * FROM usuarios WHERE rol_id = 2 LIMIT 5');
        console.log('Veterinarios:', vets);
    } catch (error) {
        console.error(error);
    }
    process.exit();
}

checkEncoding();
