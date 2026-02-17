import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../config/api';
import type { ApiResponse } from '../../config/api';

// TIPOS
export interface Owner {
    id: number;
    usuario_id: number;
    nombre: string;
    apellido: string;
    telefono: string;
    email?: string; // PUEDE VENIR DEL JOIN CON USUARIOS
    dni?: string; // SI LO HUBIERA
}

interface AdminState {
    owners: Owner[];
    loading: boolean;
    error: string | null;
    successMessage: string | null;
}

const initialState: AdminState = {
    owners: [],
    loading: false,
    error: null,
    successMessage: null
};

// THUNKS ASINCRONOS

// OBTENER TODOS LOS DUEÑOS
export const fetchDuenos = createAsyncThunk(
    'admin/fetchDuenos',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get<ApiResponse<Owner[]>>('/duenos');
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Error al obtener dueños');
        }
    }
);

// CREAR DUEÑO
export const createDueno = createAsyncThunk(
    'admin/createDueno',
    async (ownerData: any, { rejectWithValue }) => {
        try {
            const response = await api.post<ApiResponse<Owner>>('/duenos', ownerData);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Error al crear dueño');
        }
    }
);

// ACTUALIZAR DUEÑO
export const updateDueno = createAsyncThunk(
    'admin/updateDueno',
    async ({ id, data }: { id: number; data: any }, { rejectWithValue }) => {
        try {
            const response = await api.put<ApiResponse<Owner>>(`/duenos/${id}`, data);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Error al actualizar dueño');
        }
    }
);

// ELIMINAR DUEÑO
export const deleteDueno = createAsyncThunk(
    'admin/deleteDueno',
    async (id: number, { rejectWithValue }) => {
        try {
            await api.delete<ApiResponse>(`/duenos/${id}`);
            return id;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Error al eliminar dueño');
        }
    }
);

// SLICE
const adminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: {
        clearMessages: (state) => {
            state.error = null;
            state.successMessage = null;
        }
    },
    extraReducers: (builder) => {
        // FETCH OWNERS
        builder
            .addCase(fetchDuenos.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDuenos.fulfilled, (state, action) => {
                state.loading = false;
                state.owners = action.payload || [];
            })
            .addCase(fetchDuenos.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        // CREATE OWNER
        builder
            .addCase(createDueno.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createDueno.fulfilled, (state, action) => {
                state.loading = false;
                state.owners.push(action.payload!);
                state.successMessage = 'Dueño creado exitosamente';
            })
            .addCase(createDueno.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        // UPDATE OWNER
        builder
            .addCase(updateDueno.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateDueno.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.owners.findIndex(o => o.id === action.payload!.id);
                if (index !== -1) {
                    state.owners[index] = action.payload!;
                }
                state.successMessage = 'Dueño actualizado exitosamente';
            })
            .addCase(updateDueno.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        // DELETE OWNER
        builder
            .addCase(deleteDueno.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteDueno.fulfilled, (state, action) => {
                state.loading = false;
                state.owners = state.owners.filter(o => o.id !== action.payload);
                state.successMessage = 'Dueño eliminado exitosamente';
            })
            .addCase(deleteDueno.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    }
});

export const { clearMessages } = adminSlice.actions;
export default adminSlice.reducer;
