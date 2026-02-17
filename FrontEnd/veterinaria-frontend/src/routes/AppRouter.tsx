import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { LoginForm } from '../features/auth/LoginForm';
import ClientDashboard from '../features/client/ClientDashboard';
import { ProtectedRoute } from '../components/ProtectedRoute';

import { VetDashboard } from '../features/vet/VetDashboard';
import { AdminLayout } from '../features/admin/layout/AdminLayout';
import { OwnersPage } from '../features/admin/owners/OwnersPage';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';

const RootRedirect = () => {
    const { user } = useSelector((state: RootState) => state.auth);
    const role = user?.rol;

    if (role === 'veterinario') {
        return <Navigate to="/veterinario" replace />;
    }
    return <Navigate to="/dashboard" replace />;
};

// ENRUTADOR PRINCIPAL
export const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<LoginForm />} />

                <Route element={<ProtectedRoute allowedRoles={['cliente']} />}>
                    <Route path="/dashboard" element={<ClientDashboard />} />
                </Route>

                <Route element={<ProtectedRoute allowedRoles={['veterinario']} />}>
                    <Route path="/veterinario" element={<VetDashboard />} />
                </Route>

                <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                    <Route path="/admin" element={<AdminLayout />}>
                        <Route index element={<Navigate to="owners" replace />} />
                        <Route path="owners" element={<OwnersPage />} />
                        <Route path="pets" element={<div>TODO: Pets Page</div>} />
                        <Route path="vets" element={<div>TODO: Vets Page</div>} />
                        <Route path="history" element={<div>TODO: History Page</div>} />
                    </Route>
                </Route>

                <Route element={<ProtectedRoute />}>
                    <Route path="/" element={<RootRedirect />} />
                </Route>

                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </BrowserRouter>
    );
};
