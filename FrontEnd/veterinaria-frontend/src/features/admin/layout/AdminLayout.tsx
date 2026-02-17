// REMOVED UNUSED REACT IMPORT
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import styles from './AdminLayout.module.css';
import { logout } from '../../../store/slices/authSlice';
import type { RootState } from '../../../store';

// COMPONENTE LAYOUT PARA EL PANEL DE ADMINISTRADOR
// INCLUYE BARRA LATERAL (SIDEBAR) Y BARRA SUPERIOR (NAVBAR)
export const AdminLayout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state: RootState) => state.auth);

    // FUNCION PARA CERRAR SESION
    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    return (
        <div className={styles.container}>
            <nav className={styles.navbar}>
                <div className={styles.navContainer}>
                    <div className={styles.navLeft}>
                        <div className={styles.logoCircle}>
                            <span className="material-icons">pets</span>
                        </div>
                        <span className={styles.brandTitle}>patitas felices</span>
                        <span className={styles.portalBadge}>Portal Admin</span>
                    </div>

                    {/* CENTRO: ENLACES DE NAVEGACION */}
                    <div className={styles.navCenter}>
                        <NavLink
                            to="/admin/owners"
                            className={({ isActive }) => isActive ? styles.navLinkActive : styles.navLinkFade}
                        >
                            Dueños
                        </NavLink>
                        <NavLink
                            to="/admin/pets"
                            className={({ isActive }) => isActive ? styles.navLinkActive : styles.navLinkFade}
                        >
                            Pacientes
                        </NavLink>
                        <NavLink
                            to="/admin/history"
                            className={({ isActive }) => isActive ? styles.navLinkActive : styles.navLinkFade}
                        >
                            Historial
                        </NavLink>
                        <NavLink
                            to="/admin/vets"
                            className={({ isActive }) => isActive ? styles.navLinkActive : styles.navLinkFade}
                        >
                            Veterinarios
                        </NavLink>
                    </div>

                    {/* DERECHA: USUARIO Y NOTIFICACIONES */}
                    <div className={styles.navRight}>
                        <div className={styles.userProfile}>
                            <div className={styles.userInfo}>
                                <p className={styles.welcomeText}>Bienvenido,</p>
                                <p className={styles.userName}>{user?.nombre || 'Admin'}</p>
                            </div>
                            <div className={styles.avatarCircle}>
                                {user?.nombre ? user.nombre.charAt(0).toUpperCase() : 'A'}
                            </div>
                        </div>

                        <button
                            onClick={handleLogout}
                            title="Cerrar Sesión"
                            style={{
                                background: 'none', border: 'none', color: 'rgba(255,255,255,0.8)',
                                cursor: 'pointer', display: 'flex', alignItems: 'center',
                                marginLeft: '0.5rem', padding: '0.5rem', borderRadius: '50%',
                                transition: 'background-color 0.2s'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                            <span className="material-icons">logout</span>
                        </button>
                    </div>
                </div>
            </nav>

            <main className={styles.mainContent}>
                <Outlet />
            </main>
        </div>
    );
};
