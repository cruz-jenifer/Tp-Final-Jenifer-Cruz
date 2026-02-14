const BASE_URL = 'http://localhost:3000/api';

async function runTest() {
    try {
        console.log('🚀 INICIANDO FLUJO DE VERIFICACION...');

        // INICIAR SESION
        console.log('\n🔐 INICIANDO SESION...');
        const loginRes = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'test_pago@mail.com', password: 'Test1234' })
        });
        const loginData = await loginRes.json();

        if (!loginRes.ok) throw new Error(`LOGIN FALLO: ${JSON.stringify(loginData)}`);
        const token = loginData.token;
        console.log('✅ LOGIN EXITOSO');

        // VERIFICAR PERFIL
        console.log('\n👤 VERIFICANDO PERFIL...');
        const profileRes = await fetch(`${BASE_URL}/duenos/perfil`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ nombre: 'Tester', apellido: 'Pago', telefono: '123456789' })
        });

        if (profileRes.ok) {
            console.log('✅ PERFIL CREADO');
        } else {
            console.log(`⚠️ PERFIL EXISTENTE: ${profileRes.status}`);
        }

        // CREAR MASCOTA
        console.log('\n🐾 CREANDO MASCOTA...');
        const mascotaRes = await fetch(`${BASE_URL}/mascotas`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                nombre: 'Firulais',
                especie: 'Perro',
                raza: 'Callejero',
                fecha_nacimiento: '2020-01-01'
            })
        });
        const mascotaData = await mascotaRes.json();
        if (!mascotaRes.ok) throw new Error(`CREACION MASCOTA FALLO: ${JSON.stringify(mascotaData)}`);
        const mascotaId = mascotaData.data.id;
        console.log(`✅ MASCOTA CREADA (ID: ${mascotaId})`);

        // RESERVAR TURNO
        console.log('\n📅 RESERVANDO TURNO...');
        const turnoDate = new Date();
        turnoDate.setDate(turnoDate.getDate() + 1); // Mañana
        const fechaHora = turnoDate.toISOString().slice(0, 19).replace('T', ' ');

        const turnoRes = await fetch(`${BASE_URL}/turnos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                mascota_id: mascotaId,
                servicio_id: 1,
                veterinario_id: 1,
                fecha_hora: fechaHora,
                motivo: 'Prueba de Pago'
            })
        });
        const turnoData = await turnoRes.json();
        if (!turnoRes.ok) throw new Error(`RESERVA TURNO FALLO: ${JSON.stringify(turnoData)}`);
        const turnoId = turnoData.data.id;
        console.log(`✅ TURNO RESERVADO (ID: ${turnoId})`);

        // PAGAR TURNO
        console.log('\n💳 PROCESANDO PAGO SIMULADO...');
        const pagoRes = await fetch(`${BASE_URL}/pagos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                turno_id: turnoId,
                monto: 5000,
                metodo: 'tarjeta'
            })
        });
        const pagoData = await pagoRes.json();
        if (!pagoRes.ok) throw new Error(`PAGO FALLO: ${JSON.stringify(pagoData)}`);
        console.log('✅ PAGO PROCESADO');

        // VERIFICAR ESTADO
        console.log('\n🔍 VERIFICANDO ESTADO...');
        const misTurnosRes = await fetch(`${BASE_URL}/turnos/mis-turnos`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const misTurnosData = await misTurnosRes.json();
        const updatedTurno = misTurnosData.data.find(t => t.id === turnoId);

        if (updatedTurno && updatedTurno.estado === 'confirmado') {
            console.log(`✅ EXITO! TURNO ${turnoId} CONFIRMADO`);
        } else {
            console.error(`❌ FALLO! ESTADO: ${updatedTurno?.estado}`);
        }

    } catch (error) {
        console.error('\n❌ PRUEBA FALLIDA:', error.message);
    }
}

runTest();
