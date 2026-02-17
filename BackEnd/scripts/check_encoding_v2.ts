
import { pool } from '../src/config/database';

async function checkEncoding() {
    try {
        console.log('Checking tables...');
        const [tables] = await pool.query('SHOW TABLES');
        console.log('Tables:', tables);

        try {
            const [rows] = await pool.query('SELECT * FROM servicios LIMIT 5');
            console.log('Servicios:', rows);
        } catch (e) {
            console.log('Error catching servicios:', e.message);
        }

        const [vets] = await pool.query('SELECT * FROM veterinarios LIMIT 5');
        console.log('Veterinarios:', vets);
    } catch (error) {
        console.error(error);
    }
    process.exit();
}

checkEncoding();
