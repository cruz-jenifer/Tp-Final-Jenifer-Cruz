
import { useState } from 'react';
import { AgendaTable } from './components/AgendaTable';
import { MedicalHistoryForm } from './components/MedicalHistoryForm';
import { RecentRecords } from './components/RecentRecords';
import type { IAgendaItem } from '../../types/historia.types';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchAgenda } from '../../store/slices/vetSlice';
// REUSE CLIENT STYLES
import styles from '../client/ClientDashboard.module.css';
import { logout } from '../../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';

export const VetDashboard = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { user } = useAppSelector((state) => state.auth);

    const [selectedTurno, setSelectedTurno] = useState<IAgendaItem | null>(null);
    const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date().toISOString().split('T')[0]);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    // CONTADORES
    const { agenda } = useAppSelector((state) => state.vet);
    const turnosPendientes = agenda.filter(t => t.estado === 'pendiente').length;

    const handleSuccess = () => {
        setSelectedTurno(null);
        dispatch(fetchAgenda(fechaSeleccionada));
    };

    return (
        <div className={styles.container}>
            {/* NAVBAR REUSED FROM CLIENT */}
            <nav className={styles.navbar}>
                <div className={styles.navContainer}>
                    <div className={styles.navLeft}>
                        <div className={styles.logoCircle}>
                            <span className="material-icons">pets</span>
                        </div>
                        <span className={styles.brandTitle}>patitas felices</span>
                        <span className={styles.portalBadge}>Portal Veterinario</span>
                    </div>

                    <div className={styles.navCenter}>
                        <a href="#turnos" className={styles.navLink}>Turnos</a>
                        <a href="#historial" className={styles.navLinkFade}>Historial Clínico</a>
                    </div>

                    <div className={styles.navRight}>
                        <button className={styles.notificationBtn}>
                            <span className="material-icons">notifications</span>
                            <span className={styles.notificationDot}></span>
                        </button>
                        <div className={styles.userProfile}>
                            <div className={styles.userInfo}>
                                <p className={styles.welcomeText}>Bienvenido,</p>
                                <p className={styles.userName}>Dr/a. {user?.nombre || 'Veterinario'}</p>
                            </div>
                            <div className={styles.avatarCircle}>
                                {user?.nombre ? user.nombre.charAt(0).toUpperCase() : 'V'}
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
                {/* SECCION 1: MIS TURNOS */}
                <section id="turnos" className={styles.sectionScroll}>
                    <div className={styles.sectionHeader}>
                        <div className={styles.headerTitleGroup}>
                            <div className={`${styles.iconCircle} ${styles.blueRing}`}>
                                <span className="material-icons">calendar_today</span>
                            </div>
                            <div>
                                <h2 className={styles.sectionTitle}>Mis Turnos</h2>
                                <p className={styles.sectionSubtitle}>Próximas consultas asignadas</p>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <span style={{
                                backgroundColor: '#dbeafe', color: '#1e40af',
                                padding: '0.5rem 1rem', borderRadius: '9999px',
                                fontWeight: 'bold', fontSize: '0.75rem'
                            }}>
                                ● HOY: {agenda.length}
                            </span>
                            <span style={{
                                backgroundColor: '#fff7ed', color: '#9a3412',
                                padding: '0.5rem 1rem', borderRadius: '9999px',
                                fontWeight: 'bold', fontSize: '0.75rem'
                            }}>
                                PENDIENTES: {turnosPendientes}
                            </span>
                        </div>
                    </div>

                    <AgendaTable
                        onSelectTurno={setSelectedTurno}
                        fecha={fechaSeleccionada}
                        onFechaChange={setFechaSeleccionada}
                    />
                </section>

                {/* SECCION 2: GESTION MEDICA */}
                <section id="historial" className={styles.sectionScroll}>
                    <div className={styles.sectionHeader} style={{ marginTop: '3rem' }}>
                        <div className={styles.headerTitleGroup}>
                            <div className={`${styles.iconCircle}`} style={{ color: '#10b981', boxShadow: '0 0 0 4px #ecfdf5' }}>
                                <span className="material-icons">medical_services</span>
                            </div>
                            <div>
                                <h2 className={styles.sectionTitle}>Gestión Clínica</h2>
                                <p className={styles.sectionSubtitle}>Crear y administrar historiales</p>
                            </div>
                        </div>
                        <button className={styles.primaryButton} style={{ width: 'auto', backgroundColor: '#10b981' }}>
                            Mis Registros
                        </button>
                    </div>

                    <MedicalHistoryForm
                        turno={selectedTurno}
                        onSuccess={handleSuccess}
                    />
                </section>

                {/* SECCION 3: RECIENTES */}
                <section className={styles.sectionScroll} style={{ marginTop: '3rem' }}>
                    <div className={styles.sectionHeader}>
                        <h3 className={styles.sectionTitle} style={{ fontSize: '1.25rem' }}>Registros Recientes</h3>
                    </div>
                    <RecentRecords />
                </section>
            </main>
        </div>
    );
};

export default VetDashboard;
