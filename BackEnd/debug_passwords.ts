
import { pool } from './src/config/database';

const check = async () => {
    try {
        console.log('CHECKING DUENOS...');
        const [rows] = await pool.query('SELECT * FROM duenos');
        console.log('DUENOS FOUND:', rows.length);
        if (rows.length > 0) {
            console.log('FIRST DUENO KEYS:', Object.keys(rows[0]));
            console.log('SAMPLE DATA (ID, NOMBRE, CLAVE_TEMP):');
            rows.forEach((r: any) => {
                console.log(`ID: ${r.id}, Nombre: ${r.nombre}, Clave: ${r.clave_temporal}`);
            });
        } else {
            console.log('NO DUENOS FOUND.');
        }
    } catch (e) {
        console.error(e);
    } finally {
        process.exit();
    }
};

check();
