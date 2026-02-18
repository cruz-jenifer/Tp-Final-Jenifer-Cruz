
import { pool } from './src/config/database';

const checkData = async () => {
    try {
        console.log('--- CHECKING DATABASE DATA ---');
        const [duenos]: any = await pool.query('SELECT COUNT(*) as count FROM duenos');
        const [mascotas]: any = await pool.query('SELECT COUNT(*) as count FROM mascotas');
        
        console.log(`DUENOS TOTAL: ${duenos[0].count}`);
        console.log(`MASCOTAS TOTAL: ${mascotas[0].count}`);
        
        if (duenos[0].count > 0) {
             const [sample]: any = await pool.query('SELECT * FROM duenos LIMIT 3');
             console.log('SAMPLE DUENOS:', JSON.stringify(sample, null, 2));
        }

    } catch (e) {
        console.error('ERROR CHECKING DATA:', e);
    } finally {
        process.exit();
    }
};

checkData();
