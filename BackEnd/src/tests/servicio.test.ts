interface ApiResponse {
    success: boolean;
    data: any;
}

async function testGetServicios() {
    console.log('\n🧪 INICIANDO TEST DE INTEGRACION: GET /api/servicios');
    
    try {
        // REALIZAR LA PETICION AL SERVIDOR
        const respuesta = await fetch('http://localhost:3000/api/servicios');
        
        // OBTENER EL RESULTADO COM JSON
        const resultado = await respuesta.json() as ApiResponse;

        if (respuesta.status === 200 && resultado.success === true) {
            console.log('✅ ESTADO 200: OK');
            console.log('✅ FORMATO JSON: CORRECTO');
            console.log('📊 DATOS RECIBIDOS:');
            console.table(resultado.data);
        } else {
            console.error('❌ TEST FALLIDO: LA RESPUESTA NO ES LA ESPERADA');
            console.log(resultado);
        }

    } catch (error) {
        console.error('❌ ERROR CRITICO: EL SERVIDOR DEBE ESTAR CORRIENDO PARA ESTE TEST.');
        console.error('💡 TIP: EJECUTA "npm run dev" EN OTRA TERMINAL PRIMERO.');
    }
}

testGetServicios();