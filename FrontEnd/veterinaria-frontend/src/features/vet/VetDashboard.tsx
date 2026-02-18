import React, { useEffect } from 'react';
import { useState } from 'react';
import { AgendaTable } from './components/AgendaTable';
import { MedicalHistoryForm } from './components/MedicalHistoryForm';
import { RecentRecords } from './components/RecentRecords';
import type { AgendaItem } from '../../types/historial.types';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchAgenda } from '../../store/slices/vetSlice';
// REUSE CLIENT STYLES
import clientStyles from '../client/ClientDashboard.module.css';
import vet from './components/VetComponents.module.css';
import { logout } from '../../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';

export const VetDashboard = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { user } = useAppSelector((state) => state.auth);

    const [selectedTurno, setSelectedTurno] = useState<AgendaItem | null>(null);
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
        <div className={clientStyles.container}>
            {/* NAVBAR REUSED FROM CLIENT */}
            <nav className={clientStyles.navbar}>
                <div className={clientStyles.navContainer}>
                    <div className={clientStyles.navLeft}>
                        <div className={clientStyles.logoCircle}>
                            <span className="material-icons">pets</span>
                        </div>
                        <span className={clientStyles.brandTitle}>patitas felices</span>
                        <span className={clientStyles.portalBadge}>Portal Veterinario</span>
                    </div>

                    <div className={clientStyles.navCenter}>
                        <a href="#turnos" className={clientStyles.navLink}>Turnos</a>
                        <a href="#historial" className={clientStyles.navLinkFade}>Historial Clínico</a>
                    </div>

                    <div className={clientStyles.navRight}>
                        <button className={clientStyles.notificationBtn}>
                            <span className="material-icons">notifications</span>
                            <span className={clientStyles.notificationDot}></span>
                        </button>
                        <div className={clientStyles.userProfile}>
                            <div className={clientStyles.userInfo}>
                                <p className={clientStyles.welcomeText}>Bienvenido,</p>
                                <p className={clientStyles.userName}>Dr/a. {user?.nombre || 'Veterinario'}</p>
                            </div>
                            <div className={clientStyles.avatarCircle}>
                                {user?.nombre ? user.nombre.charAt(0).toUpperCase() : 'V'}
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            title="Cerrar Sesión"
                            className={vet.logoutBtn}
                        >
                            <span className="material-icons">logout</span>
                        </button>
                    </div>
                </div>
            </nav>

            <main className={clientStyles.mainContent}>
                {/* SECCION 1: MIS TURNOS */}
                <section id="turnos" className={clientStyles.sectionScroll}>
                    <div className={clientStyles.sectionHeader}>
                        <div className={clientStyles.headerTitleGroup}>
                            <div className={`${clientStyles.iconCircle} ${clientStyles.blueRing}`}>
                                <span className="material-icons">calendar_today</span>
                            </div>
                            <div>
                                <h2 className={clientStyles.sectionTitle}>Mis Turnos</h2>
                                <p className={clientStyles.sectionSubtitle}>Próximas consultas asignadas</p>
                            </div>
                        </div>
                        <div className={vet.counterGroup}>
                            <span className={vet.counterBadgeBlue}>
                                ● HOY: {agenda.length}
                            </span>
                            <span className={vet.counterBadgeOrange}>
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
                <section id="historial" className={clientStyles.sectionScroll}>
                    <div className={`${clientStyles.sectionHeader} ${vet.sectionMarginTop}`}>
                        <div className={clientStyles.headerTitleGroup}>
                            <div className={`${clientStyles.iconCircle} ${vet.iconGreen}`}>
                                <span className="material-icons">medical_services</span>
                            </div>
                            <div>
                                <h2 className={clientStyles.sectionTitle}>Gestión Clínica</h2>
                                <p className={clientStyles.sectionSubtitle}>Crear y administrar historiales</p>
                            </div>
                        </div>
                        <button className={`${clientStyles.primaryButton} ${vet.btnGreen}`}>
                            Mis Registros
                        </button>
                    </div>

                    <MedicalHistoryForm
                        turno={selectedTurno}
                        onSuccess={handleSuccess}
                    />
                </section>

                {/* SECCION 3: RECIENTES */}
                <section className={`${clientStyles.sectionScroll} ${vet.sectionMarginTop}`}>
                    <div className={clientStyles.sectionHeader}>
                        <h3 className={`${clientStyles.sectionTitle} ${vet.titleSmall}`}>Registros Recientes</h3>
                    </div>
                    <RecentRecords />
                </section>
            </main>
        </div>
    );
};

export default VetDashboard;
