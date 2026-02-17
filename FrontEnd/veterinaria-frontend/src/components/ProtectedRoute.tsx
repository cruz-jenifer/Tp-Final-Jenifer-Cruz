import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';

interface ProtectedRouteProps {
    allowedRoles?: string[];
}

// RUTA PROTEGIDA CON VERIFICACION DE ROLES
export const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
    const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
    const location = useLocation();

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRoles && user && !allowedRoles.includes(user.rol)) {
        // SI EL USUARIO NO TIENE EL ROL ADECUADO, REDIRIGIR A SU DASHBOARD
        if (user.rol === 'admin') return <Navigate to="/admin" replace />;
        if (user.rol === 'veterinario') return <Navigate to="/veterinario" replace />;
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
};
