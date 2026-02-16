
import { pool } from '../config/database';
import dotenv from 'dotenv';
dotenv.config();

async function checkLastTurno() {
    try {
        console.log('Testing INSERT behavior...');

        // 1. Insert timestamp literal
        const testDate = '2026-03-01 10:00:00';
        console.log('Inserting:', testDate);

        // Usamos un ID de usuario/mascota/vet/servicio existenetes o dummy.
        // Asumiendo que existen ID 1 para todo (seed basico). Si falla, ajustar.
        // O mejor, insertar en una tabla simple si existe? No, usemos turnos pero con try/catch si falla FK.
        // Busquemos IDs validos primero.

        const [users] = await pool.query('SELECT id FROM duenos LIMIT 1');
        const duenoId = (users as any)[0]?.id;
        const [vets] = await pool.query('SELECT id FROM veterinarios LIMIT 1');
        const vetId = (vets as any)[0]?.id;
        const [services] = await pool.query('SELECT id FROM servicios LIMIT 1');
        const serviceId = (services as any)[0]?.id;
        const [pets] = await pool.query('SELECT id FROM mascotas LIMIT 1');
        const petId = (pets as any)[0]?.id;

        if (!duenoId || !vetId || !serviceId || !petId) {
            console.error("Missing seed data (dueno, vet, service, or pet)");
            process.exit(1);
        }

        const [result] = await pool.query<any>(
            'INSERT INTO turnos (fecha_hora, veterinario_id, servicio_id, mascota_id, motivo, estado) VALUES (?, ?, ?, ?, ?, ?)',
            [testDate, vetId, serviceId, petId, 'Debug Timezone', 'pendiente']
        );

        const insertId = result.insertId;
        console.log('Inserted ID:', insertId);

        // 2. Select it back
        const [rows] = await pool.query<any>('SELECT fecha_hora FROM turnos WHERE id = ?', [insertId]);
        console.log('Read back:', rows[0].fecha_hora);

        // Cleanup
        await pool.query('DELETE FROM turnos WHERE id = ?', [insertId]);
        console.log('Cleaned up.');

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

checkLastTurno();
