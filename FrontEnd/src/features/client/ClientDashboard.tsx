import React from 'react';
import { MascotasList } from './components/MascotasList';
import { TurnosList } from './components/TurnosList';
import estilos from './ClientDashboard.module.css';
import { Modal } from '../../components/ui/Modal';
import { TurnoWizard } from '../turnos/TurnoWizard';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { cerrarSesion } from '../../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';

// DASHBOARD PRINCIPAL DEL CLIENTE
const ClientDashboard: React.FC = () => {
    const [asistenteAbierto, setAsistenteAbierto] = useState(false);
    const despacho = useAppDispatch();
    const navegar = useNavigate();
    const { usuario } = useAppSelector((state) => state.auth);

    const manejarCierreSesion = () => {
        despacho(cerrarSesion());
        navegar('/login');
    };

    return (
        <div className={estilos.container}>
            // NAVEGACIÓN SUPERIOR
            <nav className={estilos.navbar}>
                <div className={estilos.navContainer}>
                    // LOGO Y MARCA
                    <div className={estilos.navLeft}>
                        <div className={estilos.logoCircle}>
                            <span className="material-icons">pets</span>
                        </div>
                        <span className={estilos.brandTitle}>patitas felices</span>
                        <span className={estilos.portalBadge}>Portal Dueños</span>
                    </div>

                    // ENLACES
                    <div className={estilos.navCenter}>
                        <a href="#turnos" className={estilos.navLink}>Mis Turnos</a>
                        <a href="#mascotas" className={estilos.navLinkFade}>Mis Mascotas</a>
                    </div>

                    // USUARIO Y ACCIONES
                    <div className={estilos.navRight}>
                        <button className={estilos.notificationBtn}>
                            <span className="material-icons">notifications</span>
                            <span className={estilos.notificationDot}></span>
                        </button>

                        <div className={estilos.userProfile}>
                            <div className={estilos.userInfo}>
                                <p className={estilos.welcomeText}>Bienvenido/a,</p>
                                <p className={estilos.userName}>{usuario?.nombre}</p>
                            </div>
                            <div className={estilos.avatarCircle}>
                                {usuario?.nombre ? usuario.nombre.charAt(0).toUpperCase() : 'U'}
                            </div>
                        </div>

                        <button
                            onClick={manejarCierreSesion}
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

            <main className={estilos.mainContent}>
                // SECCIÓN DE TURNOS
                <section id="turnos" className={estilos.sectionScroll}>
                    <div className={estilos.sectionHeader}>
                        <div className={estilos.headerTitleGroup}>
                            <div className={`${estilos.iconCircle} ${estilos.blueRing}`}>
                                <span className="material-icons">calendar_month</span>
                            </div>
                            <div>
                                <h2 className={estilos.sectionTitle}>Próximos Turnos</h2>
                                <p className={estilos.sectionSubtitle}>Agenda de visitas veterinarias</p>
                            </div>
                        </div>
                        <button
                            className={estilos.primaryButton}
                            onClick={() => setAsistenteAbierto(true)}
                        >
                            <span className="material-icons">add_circle_outline</span>
                            Pedir Turno
                        </button>
                    </div>

                    <TurnosList />
                </section>

                // SECCIÓN DE MASCOTAS
                <section id="mascotas" className={estilos.sectionScroll}>
                    <div className={estilos.sectionHeader}>
                        <div className={estilos.headerTitleGroup}>
                            <div className={`${estilos.iconCircle} ${estilos.orangeRing}`}>
                                <span className="material-icons">pets</span>
                            </div>
                            <div>
                                <h2 className={estilos.sectionTitle}>Mis Mascotas</h2>
                                <p className={estilos.sectionSubtitle}>Fichas de tus compañeros peludos</p>
                            </div>
                        </div>
                    </div>

                    <MascotasList />
                </section>
            </main>

            // MODAL ASISTENTE
            <Modal
                isOpen={asistenteAbierto}
                onClose={() => setAsistenteAbierto(false)}
                title="Nuevo Turno"
            >
                <TurnoWizard onClose={() => setAsistenteAbierto(false)} />
            </Modal>
        </div>
    );
};

export default ClientDashboard;
