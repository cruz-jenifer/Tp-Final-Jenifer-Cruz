import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { LoginForm } from '../features/auth/LoginForm';
import ClientDashboard from '../features/client/ClientDashboard';
import { ProtectedRoute } from '../components/ProtectedRoute';

// ENRUTADOR PRINCIPAL
export const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<LoginForm />} />

                <Route element={<ProtectedRoute />}>
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/dashboard" element={<ClientDashboard />} />
                </Route>

                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </BrowserRouter>
    );
};
