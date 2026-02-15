import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginForm } from '../features/auth/LoginForm';
import { ProtectedRoute } from '../components/ProtectedRoute';

// ENRUTADOR PRINCIPAL
export const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<LoginForm />} />

                <Route element={<ProtectedRoute />}>
                    <Route path="/" element={<h1>Panel Principal (Protegido)</h1>} />
                    {/* AGREGAR MAS RUTAS PROTEGIDAS AQUI */}
                </Route>

                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </BrowserRouter>
    );
};
