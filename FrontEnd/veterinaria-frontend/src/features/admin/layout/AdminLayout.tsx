// REMOVED UNUSED REACT IMPORT
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import styles from './AdminLayout.module.css';
import { logout } from '../../../store/slices/authSlice';
import type { RootState } from '../../../store';

// SECCIONES
import OwnersPage from '../owners/OwnersPage';
import PetsPage from '../pets/PetsPage';
import AppointmentsPage from '../appointments/AppointmentsPage';
import HistoryPage from '../history/HistoryPage';
import VetsPage from '../vets/VetsPage';

// COMPONENTE LAYOUT PARA EL PANEL DE ADMINISTRADOR (SINGLE PAGE)
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
        <div className={styles.layoutContainer}>
            <nav className={styles.navbar}>
                <div className={styles.navContainer}>
                    <div className={styles.navLeft}>
                        <div className={styles.logoCircle}>
                            <span className="material-icons" style={{ color: '#6384FF' }}>pets</span>
                        </div>
                        <span className={styles.brandTitle}>patitas felices</span>
                    </div>

                    {/* CENTRO: ENLACES DE NAVEGACION (ANCHORS) */}
                    <div className={styles.navCenter}>
                        <a href="#duenos" className={styles.navLink}>Dueños</a>
                        <a href="#mascotas" className={styles.navLink}>Pacientes</a>
                        <a href="#turnos" className={styles.navLink}>Turnos</a>
                        <a href="#historial" className={styles.navLink}>Historial Med.</a>
                        <a href="#veterinarios" className={styles.navLink}>Veterinarios</a>
                    </div>

                    {/* DERECHA: USUARIO Y NOTIFICACIONES */}
                    <div className={styles.navRight}>
                        <button style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', padding: '0.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                            <span className="material-icons" style={{ color: 'white' }}>notifications</span>
                        </button>

                        <div className={styles.userAvatar}>
                            {user?.nombre ? user.nombre.charAt(0).toUpperCase() + user.nombre.charAt(1).toUpperCase() : 'DR'}
                        </div>

                        <button
                            onClick={handleLogout}
                            title="Cerrar Sesión"
                            style={{
                                background: 'none', border: 'none', color: 'rgba(255,255,255,0.8)',
                                cursor: 'pointer', display: 'flex', alignItems: 'center',
                                marginLeft: '0.5rem'
                            }}
                        >
                            <span className="material-icons">logout</span>
                        </button>
                    </div>
                </div>
            </nav>

            <main className={styles.mainContent}>
                <section id="duenos" className={styles.section}>
                    <OwnersPage />
                </section>

                <section id="mascotas" className={styles.section}>
                    <PetsPage />
                </section>

                <section id="turnos" className={styles.section}>
                    <AppointmentsPage />
                </section>

                <section id="historial" className={styles.section}>
                    <HistoryPage />
                </section>

                <section id="veterinarios" className={styles.section}>
                    <VetsPage />
                </section>
            </main>
        </div>
    );
};

