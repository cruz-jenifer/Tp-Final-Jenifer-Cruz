import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { EstadoAutenticacion } from '../../types/user.types';

const URL_API = 'http://localhost:3001/api/auth';

// ACCIONES ASÍNCRONAS
export const iniciarSesion = createAsyncThunk(
    'auth/iniciarSesion',
    async (credenciales: { email: string; password: string }, { rejectWithValue }) => {
        try {
            const respuesta = await fetch(`${URL_API}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credenciales),
            });

            if (!respuesta.ok) {
                const datosError = await respuesta.json().catch(() => ({}));
                throw new Error(datosError.mensaje || 'Error al iniciar sesión');
            }

            const resultado = await respuesta.json();
            // ESTANDARIZAR A ESPAÑOL: backend devuelve { token, user }
            return {
                token: resultado.data.token,
                usuario: resultado.data.user
            };
        } catch (error: unknown) {
            const mensaje = error instanceof Error ? error.message : 'Error al iniciar sesión';
            return rejectWithValue(mensaje);
        }
    }
);

// RECUPERACION SEGURA DEL USUARIO ALMACENADO
const obtenerUsuarioAlmacenado = () => {
    const almacenado = localStorage.getItem('user');

    // VALIDACION DE VALORES NULOS O INDEFINIDOS EN CADENA
    if (!almacenado || almacenado === 'undefined' || almacenado === 'null') {
        return null;
    }

    try {
        return JSON.parse(almacenado);
    } catch (e: unknown) {
        console.error('ERROR AL PARSEAR USUARIO DEL STORAGE:', e);
        return null;
    }
};

// RECUPERACION SEGURA DEL TOKEN
const obtenerTokenAlmacenado = () => {
    const token = localStorage.getItem('token');
    if (!token || token === 'undefined' || token === 'null') {
        return null;
    }
    return token;
};

// CONFIGURACION DEL ESTADO INICIAL
const usuarioPersistido = obtenerUsuarioAlmacenado();
const tokenPersistido = obtenerTokenAlmacenado();

const estadoInicial: EstadoAutenticacion = {
    usuario: usuarioPersistido,
    token: tokenPersistido,
    // SOLO MARCAR COMO AUTENTICADO SI AMBOS DATOS SON VALIDOS
    estaAutenticado: !!(usuarioPersistido && tokenPersistido),
    cargando: false,
    error: null,
};

// SLICE DE AUTENTICACIÓN
const sliceAutenticacion = createSlice({
    name: 'auth',
    initialState: estadoInicial,
    reducers: {
        cerrarSesion: (estado) => {
            estado.usuario = null;
            estado.token = null;
            estado.estaAutenticado = false;
            estado.error = null;
            localStorage.removeItem('user');
            localStorage.removeItem('token');
        },
        limpiarError: (estado) => {
            estado.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(iniciarSesion.pending, (estado) => {
                estado.cargando = true;
                estado.error = null;
            })
            .addCase(iniciarSesion.fulfilled, (estado, accion) => {
                estado.cargando = false;
                estado.estaAutenticado = true;
                estado.usuario = accion.payload.usuario;
                estado.token = accion.payload.token;
                localStorage.setItem('user', JSON.stringify(accion.payload.usuario));
                localStorage.setItem('token', accion.payload.token);
            })
            .addCase(iniciarSesion.rejected, (estado, accion) => {
                estado.cargando = false;
                estado.error = accion.payload as string;
            });
    }
});

export const { cerrarSesion, limpiarError } = sliceAutenticacion.actions;
export default sliceAutenticacion.reducer;
