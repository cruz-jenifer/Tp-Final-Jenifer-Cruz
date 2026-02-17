
import { pool } from '../src/config/database';
import bcrypt from 'bcrypt';

async function seedFeat4() {
    console.log('🌱 Iniciando Seed para Feat 4...');

    try {
        // 1. Limpiar datos de prueba anteriores (opcional, para evitar duplicados si se corre varias veces)
        // Por seguridad, solo borramos usuarios con emails específicos de prueba
        await pool.query('DELETE FROM turnos WHERE veterinario_id IN (SELECT id FROM veterinarios WHERE usuario_id IN (SELECT id FROM usuarios WHERE email LIKE "%@feat4.com"))');
        await pool.query('DELETE FROM historiales WHERE veterinario_id IN (SELECT id FROM veterinarios WHERE usuario_id IN (SELECT id FROM usuarios WHERE email LIKE "%@feat4.com"))');
        await pool.query('DELETE FROM mascotas WHERE dueno_id IN (SELECT id FROM duenos WHERE usuario_id IN (SELECT id FROM usuarios WHERE email LIKE "%@feat4.com"))');
        await pool.query('DELETE FROM veterinarios WHERE usuario_id IN (SELECT id FROM usuarios WHERE email LIKE "%@feat4.com")');
        await pool.query('DELETE FROM duenos WHERE usuario_id IN (SELECT id FROM usuarios WHERE email LIKE "%@feat4.com")');
        await pool.query('DELETE FROM usuarios WHERE email LIKE "%@feat4.com"');

        console.log('🧹 Limpieza de datos de prueba completada.');

        const passwordHash = await bcrypt.hash('123456', 10);

        // 2. Crear 2 Veterinarios
        const vets = [
            { nombre: 'Ana', apellido: 'Veterinaria', email: 'ana@feat4.com', matricula: 'MP-1001' },
            { nombre: 'Carlos', apellido: 'Cirujano', email: 'carlos@feat4.com', matricula: 'MP-1002' }
        ];

        for (const vet of vets) {
            const [userResult]: any = await pool.query('INSERT INTO usuarios (email, password, rol) VALUES (?, ?, ?)', [vet.email, passwordHash, 'veterinario']);
            const userId = userResult.insertId;
            await pool.query('INSERT INTO veterinarios (usuario_id, nombre, apellido, matricula) VALUES (?, ?, ?, ?)', [userId, vet.nombre, vet.apellido, vet.matricula]);
            console.log(`✅ Veterinario creado: ${vet.email} / 123456`);
        }

        // 3. Crear 2 Dueños
        const duenos = [
            { nombre: 'Laura', apellido: 'Gomez', email: 'laura@feat4.com', telefono: '1111-1111' },
            { nombre: 'Pedro', apellido: 'Perez', email: 'pedro@feat4.com', telefono: '2222-2222' }
        ];

        const duenoIds = [];

        for (const dueno of duenos) {
            const [userResult]: any = await pool.query('INSERT INTO usuarios (email, password, rol) VALUES (?, ?, ?)', [dueno.email, passwordHash, 'cliente']);
            const userId = userResult.insertId;
            const [duenoResult]: any = await pool.query('INSERT INTO duenos (usuario_id, nombre, apellido, telefono) VALUES (?, ?, ?, ?)', [userId, dueno.nombre, dueno.apellido, dueno.telefono]);
            duenoIds.push(duenoResult.insertId); // Guardamos ID de dueno (no usuario)
            console.log(`✅ Dueño creado: ${dueno.email} / 123456`);
        }

        // 4. Crear Mascotas (1 para Laura, 2 para Pedro)
        const mascotas = [
            { nombre: 'Firulais', especie: 'Perro', raza: 'Mestizo', edad: 5, duenoId: duenoIds[0] },
            { nombre: 'Michi', especie: 'Gato', raza: 'Siames', edad: 3, duenoId: duenoIds[1] },
            { nombre: 'Rex', especie: 'Perro', raza: 'Ovejero', edad: 7, duenoId: duenoIds[1] }
        ];

        const mascotaIds = [];

        for (const mascota of mascotas) {
            const birthDate = new Date();
            birthDate.setFullYear(birthDate.getFullYear() - mascota.edad);
            const fechaNacimiento = birthDate.toISOString().split('T')[0];

            const [mascotaResult]: any = await pool.query('INSERT INTO mascotas (dueno_id, nombre, especie, raza, fecha_nacimiento) VALUES (?, ?, ?, ?, ?)', [mascota.duenoId, mascota.nombre, mascota.especie, mascota.raza, fechaNacimiento]);
            mascotaIds.push(mascotaResult.insertId);
            console.log(`✅ Mascota creada: ${mascota.nombre}`);
        }

        // 5. Crear Turnos para HOY (Para probar Agenda)
        // Necesitamos el ID del veterinario Ana
        const [vetAnaResult]: any = await pool.query('SELECT id FROM veterinarios WHERE matricula = "MP-1001"');
        const anaId = vetAnaResult[0].id;

        const hoy = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

        const turnos = [
            { fecha: `${hoy} 09:00:00`, veterinario_id: anaId, mascota_id: mascotaIds[0], motivo: 'Vacunación', estado: 'pendiente' },
            { fecha: `${hoy} 10:00:00`, veterinario_id: anaId, mascota_id: mascotaIds[1], motivo: 'Consulta General', estado: 'completado' },
            { fecha: `${hoy} 11:00:00`, veterinario_id: anaId, mascota_id: mascotaIds[2], motivo: 'Revisión', estado: 'pendiente' }
        ];

        for (const turno of turnos) {
            await pool.query('INSERT INTO turnos (fecha_hora, veterinario_id, mascota_id, motivo, estado, servicio_id) VALUES (?, ?, ?, ?, ?, ?)', [turno.fecha, turno.veterinario_id, turno.mascota_id, turno.motivo, turno.estado, 1]);
            console.log(`✅ Turno creado para: ${turno.fecha}`);
        }

        // 6. Crear un historial previo para probar "Recientes"
        await pool.query('INSERT INTO historiales (mascota_id, veterinario_id, fecha, diagnostico, tratamiento) VALUES (?, ?, NOW(), ?, ?)', [mascotaIds[1], anaId, 'Gripe felina', 'Reposo y líquidos']);
        console.log(`✅ Historial previo creado.`);

        console.log('🚀 Seed completado exitosamente.');
        process.exit(0);

    } catch (error) {
        console.error('❌ Error en el seed:', error);
        process.exit(1);
    }
}

seedFeat4();
