import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const URL_API = 'http://localhost:3001/api';

// TIPOS
export interface Servicio {
    id: number;
    nombre: string;
    duracion_minutos?: number;
}

interface EstadoServicios {
    servicios: Servicio[];
    cargando: boolean;
    error: string | null;
}

const estadoInicial: EstadoServicios = {
    servicios: [],
    cargando: false,
    error: null,
};

// ACCIONES ASÍNCRONAS
export const obtenerServicios = createAsyncThunk(
    'servicios/obtenerTodos',
    async () => {
        const token = localStorage.getItem('token');
        const respuesta = await fetch(`${URL_API}/servicios`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (!respuesta.ok) {
            throw new Error('Error al cargar servicios');
        }

        return respuesta.json();
    }
);

export const crearServicio = createAsyncThunk(
    'servicios/crear',
    async (datos: Omit<Servicio, 'id'>) => {
        const token = localStorage.getItem('token');
        const respuesta = await fetch(`${URL_API}/servicios`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(datos)
        });

        if (!respuesta.ok) {
            const error = await respuesta.json();
            throw new Error(error.mensaje || 'Error al crear servicio');
        }
        return await respuesta.json();
    }
);

export const actualizarServicio = createAsyncThunk(
    'servicios/actualizar',
    async ({ id, datos }: { id: number; datos: Partial<Servicio> }) => {
        const token = localStorage.getItem('token');
        const respuesta = await fetch(`${URL_API}/servicios/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(datos)
        });

        if (!respuesta.ok) {
            const error = await respuesta.json();
            throw new Error(error.mensaje || 'Error al actualizar servicio');
        }
        return await respuesta.json();
    }
);

export const eliminarServicio = createAsyncThunk(
    'servicios/eliminar',
    async (id: number) => {
        const token = localStorage.getItem('token');
        const respuesta = await fetch(`${URL_API}/servicios/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!respuesta.ok) {
            throw new Error('Error al eliminar servicio');
        }
        return id;
    }
);

// SLICE DE SERVICIOS
const sliceServicios = createSlice({
    name: 'servicios',
    initialState: estadoInicial,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // OBTENER
            .addCase(obtenerServicios.pending, (estado) => {
                estado.cargando = true;
                estado.error = null;
            })
            .addCase(obtenerServicios.fulfilled, (estado, accion) => {
                estado.cargando = false;
                estado.servicios = accion.payload.data || accion.payload;
            })
            .addCase(obtenerServicios.rejected, (estado, accion) => {
                estado.cargando = false;
                estado.error = accion.error.message || 'Error al cargar servicios';
            })
            // CREAR
            .addCase(crearServicio.fulfilled, (estado, accion) => {
                const nuevoServicio = accion.payload.data || accion.payload;
                if (nuevoServicio && nuevoServicio.id) {
                    estado.servicios.push(nuevoServicio);
                }
            })
            // ACTUALIZAR
            .addCase(actualizarServicio.fulfilled, (estado, accion) => {
                const servicioActualizado = accion.payload.data || accion.payload;
                const indice = estado.servicios.findIndex(s => s.id === servicioActualizado.id);
                if (indice !== -1) {
                    estado.servicios[indice] = servicioActualizado;
                }
            })
            // ELIMINAR
            .addCase(eliminarServicio.fulfilled, (estado, accion) => {
                estado.servicios = estado.servicios.filter(s => s.id !== accion.payload);
            });
    },
});

export default sliceServicios.reducer;
