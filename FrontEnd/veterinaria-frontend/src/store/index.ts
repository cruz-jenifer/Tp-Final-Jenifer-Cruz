import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import mascotasReducer from './slices/mascotasSlice';
import turnosReducer from './slices/turnosSlice';

// CONFIGURACION DEL STORE
export const store = configureStore({
    reducer: {
        auth: authReducer,
        mascotas: mascotasReducer,
        turnos: turnosReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
