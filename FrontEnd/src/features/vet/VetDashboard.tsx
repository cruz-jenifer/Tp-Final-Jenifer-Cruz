import { useState } from 'react';
import { AgendaTable } from './components/AgendaTable';
import { MedicalHistoryForm } from './components/MedicalHistoryForm';
import { RecentRecords } from './components/RecentRecords';
import type { AgendaItem } from '../../types/historial.types';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { obtenerAgenda } from '../../store/slices/vetSlice';
import estilosCliente from '../client/ClientDashboard.module.css';
import estilosVet from './components/VetComponents.module.css';
import { cerrarSesion } from '../../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';

export const VetDashboard = () => {
    const despacho = useAppDispatch();
    const navegar = useNavigate();
    const { usuario } = useAppSelector((state) => state.auth);

    const [turnoSeleccionado, setTurnoSeleccionado] = useState<AgendaItem | null>(null);
    const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date().toISOString().split('T')[0]);

    const manejarCierreSesion = () => {
        despacho(cerrarSesion());
        navegar('/login');
    };

    // ESTADÍSTICAS
    const { agenda } = useAppSelector((state) => state.vet);
    const agendaSegura = Array.isArray(agenda) ? agenda : [];
    const turnosPendientes = agendaSegura.filter(t => t.estado === 'pendiente').length;

    const manejarExito = () => {
        setTurnoSeleccionado(null);
        despacho(obtenerAgenda(fechaSeleccionada));
    };

    return (
        <div className={estilosCliente.container}>
            // NAVEGACIÓN SUPERIOR
            <nav className={estilosCliente.navbar}>
                <div className={estilosCliente.navContainer}>
                    <div className={estilosCliente.navLeft}>
                        <div className={estilosCliente.logoCircle}>
                            <span className="material-icons">pets</span>
                        </div>
                        <span className={estilosCliente.brandTitle}>patitas felices</span>
                        <span className={estilosCliente.portalBadge}>Portal Veterinario</span>
                    </div>

                    <div className={estilosCliente.navCenter}>
                        <a href="#turnos" className={estilosCliente.navLink}>Turnos</a>
                        <a href="#historial" className={estilosCliente.navLinkFade}>Historial Clínico</a>
                    </div>

                    <div className={estilosCliente.navRight}>
                        <button className={estilosCliente.notificationBtn}>
                            <span className="material-icons">notifications</span>
                            <span className={estilosCliente.notificationDot}></span>
                        </button>
                        <div className={estilosCliente.userProfile}>
                            <div className={estilosCliente.userInfo}>
                                <p className={estilosCliente.welcomeText}>Bienvenido,</p>
                                <p className={estilosCliente.userName}>Dr/a. {usuario?.nombre || 'Veterinario'}</p>
                            </div>
                            <div className={estilosCliente.avatarCircle}>
                                {usuario?.nombre ? usuario.nombre.charAt(0).toUpperCase() : 'V'}
                            </div>
                        </div>
                        <button
                            onClick={manejarCierreSesion}
                            title="Cerrar Sesión"
                            className={estilosVet.logoutBtn}
                        >
                            <span className="material-icons">logout</span>
                        </button>
                    </div>
                </div>
            </nav>

            <main className={estilosCliente.mainContent}>
                // SECCIÓN DE TURNOS
                <section id="turnos" className={estilosCliente.sectionScroll}>
                    <div className={estilosCliente.sectionHeader}>
                        <div className={estilosCliente.headerTitleGroup}>
                            <div className={`${estilosCliente.iconCircle} ${estilosCliente.blueRing}`}>
                                <span className="material-icons">calendar_today</span>
                            </div>
                            <div>
                                <h2 className={estilosCliente.sectionTitle}>Mis Turnos</h2>
                                <p className={estilosCliente.sectionSubtitle}>Próximas consultas asignadas</p>
                            </div>
                        </div>
                        <div className={estilosVet.counterGroup}>
                            <span className={estilosVet.counterBadgeBlue}>
                                ● HOY: {agenda.length}
                            </span>
                            <span className={estilosVet.counterBadgeOrange}>
                                PENDIENTES: {turnosPendientes}
                            </span>
                        </div>
                    </div>

                    <AgendaTable
                        onSelectTurno={setTurnoSeleccionado}
                        fecha={fechaSeleccionada}
                        onFechaChange={setFechaSeleccionada}
                    />
                </section>

                // SECCIÓN DE GESTIÓN CLÍNICA
                <section id="historial" className={estilosCliente.sectionScroll}>
                    <div className={`${estilosCliente.sectionHeader} ${estilosVet.sectionMarginTop}`}>
                        <div className={estilosCliente.headerTitleGroup}>
                            <div className={`${estilosCliente.iconCircle} ${estilosVet.iconGreen}`}>
                                <span className="material-icons">medical_services</span>
                            </div>
                            <div>
                                <h2 className={estilosCliente.sectionTitle}>Gestión Clínica</h2>
                                <p className={estilosCliente.sectionSubtitle}>Crear y administrar historiales</p>
                            </div>
                        </div>
                        <button className={`${estilosCliente.primaryButton} ${estilosVet.btnGreen}`}>
                            Mis Registros
                        </button>
                    </div>

                    <MedicalHistoryForm
                        turno={turnoSeleccionado}
                        onSuccess={manejarExito}
                    />
                </section>

                // SECCIÓN DE REGISTROS RECIENTES
                <section className={`${estilosCliente.sectionScroll} ${estilosVet.sectionMarginTop}`}>
                    <div className={estilosCliente.sectionHeader}>
                        <h3 className={`${estilosCliente.sectionTitle} ${estilosVet.titleSmall}`}>Registros Recientes</h3>
                    </div>
                    <RecentRecords />
                </section>
            </main>
        </div>
    );
};

export default VetDashboard;
