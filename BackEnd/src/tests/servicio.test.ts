interface ApiResponse {
    success: boolean;
    data: any;
}

async function testGetServicios() {
    console.log('\n🧪 INICIANDO TEST DE INTEGRACION: GET /api/servicios');
    
    try {
       
        const response = await fetch('http://localhost:3000/api/servicios');
        
       
        const resultado = await response.json() as ApiResponse;

        if (response.status === 200 && resultado.success === true) {
            console.log('✅ STATUS 200: OK');
            console.log('✅ FORMATO JSON: CORRECTO');
            console.log('📊 DATOS RECIBIDOS:');
            console.table(resultado.data);
        } else {
            console.error('❌ TEST FALLIDO: La respuesta no es la esperada');
            console.log(resultado);
        }

    } catch (error) {
        console.error('❌ ERROR CRITICO: El servidor debe estar corriendo para este test.');
        console.error('💡 TIP: Ejecuta "npm run dev" en otra terminal primero.');
    }
}

testGetServicios();