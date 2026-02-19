import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { Turno } from '../../types/turno.types';
import type { RootState } from '../index';

// ESTADO INICIAL EN ESPAÑOL
interface EstadoTurnos {
    turnos: Turno[];
    cargando: boolean;
    error: string | null;
}

const estadoInicial: EstadoTurnos = {
    turnos: [],
    cargando: false,
    error: null,
};

// API BASE URL
const API_URL = 'http://localhost:3001/api/turnos';

// OPERACIONES ASINCRONAS (THUNKS) EN ESPAÑOL

// OBTENER MIS TURNOS
export const obtenerMisTurnos = createAsyncThunk(
    'turnos/obtenerMisTurnos',
    async (_, { getState, rejectWithValue }) => {
        try {
            const token = (getState() as RootState).auth.token;
            if (!token) throw new Error('Token no encontrado');

            const respuesta = await fetch(`${API_URL}/mis-turnos`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!respuesta.ok) {
                const datosError = await respuesta.json().catch(() => ({}));
                throw new Error(datosError.mensaje || `Error ${respuesta.status}: ${respuesta.statusText}`);
            }

            const resultado = await respuesta.json();
            return resultado.data as Turno[];
        } catch (error: unknown) {
            const mensaje = error instanceof Error ? error.message : 'Error desconocido';
            return rejectWithValue(mensaje);
        }
    }
);

// CREAR TURNO
export const crearTurno = createAsyncThunk(
    'turnos/crearTurno',
    async (turno: Partial<Turno>, { getState, rejectWithValue }) => {
        try {
            const token = (getState() as RootState).auth.token;
            if (!token) throw new Error('Token no encontrado');

            const respuesta = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(turno)
            });

            if (!respuesta.ok) {
                const datosError = await respuesta.json().catch(() => ({}));
                throw new Error(datosError.mensaje || `Error ${respuesta.status}: ${respuesta.statusText}`);
            }

            return await respuesta.json();
        } catch (error: unknown) {
            const mensaje = error instanceof Error ? error.message : 'Error desconocido';
            return rejectWithValue(mensaje);
        }
    }
);

// CANCELAR TURNO
export const cancelarTurno = createAsyncThunk(
    'turnos/cancelarTurno',
    async (id: number, { getState, rejectWithValue }) => {
        try {
            const token = (getState() as RootState).auth.token;
            if (!token) throw new Error('Token no encontrado');

            const respuesta = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!respuesta.ok) {
                const datosError = await respuesta.json().catch(() => ({}));
                throw new Error(datosError.mensaje || `Error ${respuesta.status}: ${respuesta.statusText}`);
            }

            return id;
        } catch (error: unknown) {
            const mensaje = error instanceof Error ? error.message : 'Error desconocido';
            return rejectWithValue(mensaje);
        }
    }
);

// ACTUALIZAR TURNO
export const actualizarTurno = createAsyncThunk(
    'turnos/actualizarTurno',
    async ({ id, datos }: { id: number; datos: Partial<Turno> }, { getState, rejectWithValue }) => {
        try {
            const token = (getState() as RootState).auth.token;
            if (!token) throw new Error('Token no encontrado');

            const respuesta = await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(datos)
            });

            if (!respuesta.ok) {
                const datosError = await respuesta.json().catch(() => ({}));
                throw new Error(datosError.mensaje || `Error ${respuesta.status}: ${respuesta.statusText}`);
            }

            return { id, datos };
        } catch (error: unknown) {
            const mensaje = error instanceof Error ? error.message : 'Error desconocido';
            return rejectWithValue(mensaje);
        }
    }
);

// ELIMINAR TURNO (FISICO)
export const eliminarTurno = createAsyncThunk(
    'turnos/eliminarTurno',
    async (id: number, { getState, rejectWithValue }) => {
        try {
            const token = (getState() as RootState).auth.token;
            if (!token) throw new Error('Token no encontrado');

            const respuesta = await fetch(`${API_URL}/${id}?force=true`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!respuesta.ok) {
                const datosError = await respuesta.json().catch(() => ({}));
                throw new Error(datosError.mensaje || `Error ${respuesta.status}: ${respuesta.statusText}`);
            }

            return id;
        } catch (error: unknown) {
            const mensaje = error instanceof Error ? error.message : 'Error desconocido';
            return rejectWithValue(mensaje);
        }
    }
);

// AGENDA GLOBAL DEL ADMIN
export const obtenerAgendaAdmin = createAsyncThunk(
    'turnos/obtenerAgendaAdmin',
    async (fecha: string | undefined, { getState, rejectWithValue }) => {
        try {
            const token = (getState() as RootState).auth.token;
            if (!token) throw new Error('Token no encontrado');

            const url = fecha ? `${API_URL}/agenda?fecha=${fecha}` : `${API_URL}/agenda`;

            const respuesta = await fetch(url, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!respuesta.ok) {
                const datosError = await respuesta.json().catch(() => ({}));
                throw new Error(datosError.mensaje || 'Error al cargar agenda');
            }

            const resultado = await respuesta.json();
            const lista = resultado.data?.turnos ?? resultado.data ?? [];
            return Array.isArray(lista) ? lista : [];
        } catch (error: unknown) {
            const mensaje = error instanceof Error ? error.message : 'Error desconocido';
            return rejectWithValue(mensaje);
        }
    }
);

// VERIFICAR DISPONIBILIDAD
export const verificarDisponibilidad = createAsyncThunk(
    'turnos/verificarDisponibilidad',
    async ({ veterinario_id, fecha, hora }: { veterinario_id: number; fecha: string; hora: string }, { getState, rejectWithValue }) => {
        try {
            const token = (getState() as RootState).auth.token;
            if (!token) throw new Error('Token no encontrado');

            const respuesta = await fetch(`${API_URL}/check-availability?veterinario_id=${veterinario_id}&fecha=${fecha}&hora=${hora}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!respuesta.ok) throw new Error('Error al verificar disponibilidad');

            const resultado = await respuesta.json();
            return resultado.data?.disponible ?? false;
        } catch (error: unknown) {
            const mensaje = error instanceof Error ? error.message : 'Error desconocido';
            return rejectWithValue(mensaje);
        }
    }
);

// SLICE DE TURNOS
const sliceTurnos = createSlice({
    name: 'turnos',
    initialState: estadoInicial,
    reducers: {},
    extraReducers: (builder) => {
        // OBTENER MIS TURNOS
        builder.addCase(obtenerMisTurnos.pending, (estado) => { estado.cargando = true; estado.error = null; });
        builder.addCase(obtenerMisTurnos.fulfilled, (estado, accion) => { estado.cargando = false; estado.turnos = accion.payload; });
        builder.addCase(obtenerMisTurnos.rejected, (estado, accion) => { estado.cargando = false; estado.error = accion.payload as string; });

        // CREAR TURNO
        builder.addCase(crearTurno.pending, (estado) => { estado.cargando = true; estado.error = null; });
        builder.addCase(crearTurno.fulfilled, (estado) => { estado.cargando = false; });
        builder.addCase(crearTurno.rejected, (estado, accion) => { estado.cargando = false; estado.error = accion.payload as string; });

        // CANCELAR TURNO
        builder.addCase(cancelarTurno.pending, (estado) => { estado.cargando = true; estado.error = null; });
        builder.addCase(cancelarTurno.fulfilled, (estado, accion) => {
            estado.cargando = false;
            const indice = estado.turnos.findIndex(t => t.id === accion.payload);
            if (indice !== -1) estado.turnos[indice].estado = 'cancelado';
        });
        builder.addCase(cancelarTurno.rejected, (estado, accion) => { estado.cargando = false; estado.error = accion.payload as string; });

        // ACTUALIZAR TURNO
        builder.addCase(actualizarTurno.fulfilled, (estado, accion) => {
            estado.cargando = false;
            const indice = estado.turnos.findIndex(t => t.id === accion.payload.id);
            if (indice !== -1) estado.turnos[indice] = { ...estado.turnos[indice], ...accion.payload.datos };
        });

        // ELIMINAR TURNO
        builder.addCase(eliminarTurno.fulfilled, (estado, accion) => {
            estado.cargando = false;
            estado.turnos = estado.turnos.filter(t => t.id !== accion.payload);
        });

        // AGENDA ADMIN
        builder.addCase(obtenerAgendaAdmin.pending, (estado) => { estado.cargando = true; estado.error = null; });
        builder.addCase(obtenerAgendaAdmin.fulfilled, (estado, accion) => {
            estado.cargando = false;
            estado.turnos = accion.payload;
        });
        builder.addCase(obtenerAgendaAdmin.rejected, (estado, accion) => { estado.cargando = false; estado.error = accion.payload as string; });
    }
});

export default sliceTurnos.reducer;
