import React from 'react';
import { MascotasList } from './components/MascotasList';
import { TurnosList } from './components/TurnosList';
import styles from './ClientDashboard.module.css';

import { Modal } from '../../components/ui/Modal';
import { TurnoWizard } from '../turnos/TurnoWizard';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { logout } from '../../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';

// DASHBOARD PRINCIPAL DEL CLIENTE
const ClientDashboard: React.FC = () => {
    const [isWizardOpen, setIsWizardOpen] = useState(false);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { user } = useAppSelector((state) => state.auth);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    return (
        <div className={styles.container}>
            {/* NAVBAR STITCH: SUPERIOR FIJA (3 SECCIONES) */}
            <nav className={styles.navbar}>
                <div className={styles.navContainer}>
                    {/* IZQUIERDA: LOGO Y MARCA */}
                    <div className={styles.navLeft}>
                        <div className={styles.logoCircle}>
                            <span className="material-icons">pets</span>
                        </div>
                        <span className={styles.brandTitle}>patitas felices</span>
                        <span className={styles.portalBadge}>Portal Dueños</span>
                    </div>

                    {/* CENTRO: ENLACES DE NAVEGACION */}
                    <div className={styles.navCenter}>
                        <a href="#turnos" className={styles.navLink}>Mis Turnos</a>
                        <a href="#mascotas" className={styles.navLinkFade}>Mis Mascotas</a>
                    </div>

                    {/* DERECHA: USUARIO Y NOTIFICACIONES */}
                    <div className={styles.navRight}>
                        <button className={styles.notificationBtn}>
                            <span className="material-icons">notifications</span>
                            <span className={styles.notificationDot}></span>
                        </button>

                        <div className={styles.userProfile}>
                            <div className={styles.userInfo}>
                                <p className={styles.welcomeText}>Bienvenido/a,</p>
                                <p className={styles.userName}>{user?.nombre}</p>
                            </div>
                            <div className={styles.avatarCircle}>
                                {user?.nombre ? user.nombre.charAt(0).toUpperCase() : 'U'}
                            </div>
                        </div>

                        <button
                            onClick={handleLogout}
                            title="Cerrar Sesión"
                            style={{
                                background: 'none', border: 'none', color: '#6b7280',
                                cursor: 'pointer', display: 'flex', alignItems: 'center',
                                marginLeft: '0.5rem', padding: '0.5rem', borderRadius: '50%',
                                transition: 'background-color 0.2s'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                            <span className="material-icons">logout</span>
                        </button>
                    </div>
                </div>
            </nav>

            <main className={styles.mainContent}>
                {/* SECCION DE TURNOS */}
                <section id="turnos" className={styles.sectionScroll}>
                    <div className={styles.sectionHeader}>
                        <div className={styles.headerTitleGroup}>
                            <div className={`${styles.iconCircle} ${styles.blueRing}`}>
                                <span className="material-icons">calendar_month</span>
                            </div>
                            <div>
                                <h2 className={styles.sectionTitle}>Próximos Turnos</h2>
                                <p className={styles.sectionSubtitle}>Agenda de visitas veterinarias</p>
                            </div>
                        </div>
                        <button
                            className={styles.primaryButton}
                            onClick={() => setIsWizardOpen(true)}
                        >
                            <span className="material-icons">add_circle_outline</span>
                            Pedir Turno
                        </button>
                    </div>

                    <TurnosList />
                </section>

                {/* SECCION DE MASCOTAS */}
                <section id="mascotas" className={styles.sectionScroll}>
                    <div className={styles.sectionHeader}>
                        <div className={styles.headerTitleGroup}>
                            <div className={`${styles.iconCircle} ${styles.orangeRing}`}>
                                <span className="material-icons">pets</span>
                            </div>
                            <div>
                                <h2 className={styles.sectionTitle}>Mis Mascotas</h2>
                                <p className={styles.sectionSubtitle}>Fichas de tus compañeros peludos</p>
                            </div>
                        </div>
                    </div>

                    <MascotasList />
                </section>
            </main>

            {/* MODAL WIZARD */}
            <Modal
                isOpen={isWizardOpen}
                onClose={() => setIsWizardOpen(false)}
                title="Nuevo Turno"
            >
                <TurnoWizard onClose={() => setIsWizardOpen(false)} />
            </Modal>
        </div>
    );
};

export default ClientDashboard;
