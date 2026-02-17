
import { pool } from '../src/config/database';

async function checkAna() {
    try {
        console.log('--- CHECKING ANA ---');
        const [users]: any[] = await pool.query('SELECT * FROM usuarios WHERE email = "ana@feat4.com"');
        if (users.length === 0) {
            console.log('User Ana NOT FOUND');
        } else {
            const user = users[0];
            console.log('User Ana FOUND:', user);
            const [vets]: any[] = await pool.query('SELECT * FROM veterinarios WHERE usuario_id = ?', [user.id]);
            if (vets.length === 0) {
                console.log('Vet Profile for Ana NOT FOUND');
            } else {
                console.log('Vet Profile for Ana FOUND:', vets[0]);
            }
        }
    } catch (e) {
        console.error(e);
    }
    process.exit();
}

checkAna();
