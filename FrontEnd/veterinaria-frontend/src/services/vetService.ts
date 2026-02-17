
const API_URL = 'http://localhost:3000/api';

export const vetService = {
    // Obtener Agenda del Día
    getAgenda: async (fecha: string) => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/veterinarios/agenda?fecha=${fecha}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Error al cargar la agenda');
        }

        return await response.json();
    },

    //  Obtener Historial Reciente (Últimos 5 registros)
    getRecentRecords: async () => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/veterinarios/historial-reciente`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Error al cargar historial reciente');
        }

        return await response.json();
    },

    //  Crear Historial Médico
    createMedicalRecord: async (data: any) => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/veterinarios/historial`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Error al guardar historial');
        }

        return await response.json();
    },

    //  Obtener Mascota por ID (Detalle completo)
    getMascotaById: async (id: number) => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/mascotas/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Error al cargar datos de mascota');
        }

        return await response.json();
    },

    //  Eliminar Historial
    deleteMedicalRecord: async (id: number) => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/historial/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Error al eliminar historial');
        }
        return true;
    },

    //  Actualizar Historial
    updateMedicalRecord: async (id: number, data: any) => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/historial/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error('Error al actualizar historial');
        }
        return await response.json();
    }
};
