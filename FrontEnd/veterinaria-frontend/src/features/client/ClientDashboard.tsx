import React from 'react';
import { MascotasList } from './components/MascotasList';
import { TurnosList } from './components/TurnosList';
import styles from './ClientDashboard.module.css';

import { Modal } from '../../components/ui/Modal';
import { TurnoWizard } from '../turnos/TurnoWizard';
import { useState } from 'react';

// DASHBOARD PRINCIPAL DEL CLIENTE
const ClientDashboard: React.FC = () => {
    const [isWizardOpen, setIsWizardOpen] = useState(false);

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
                                <p className={styles.welcomeText}>Bienvenida,</p>
                                <p className={styles.userName}>María González</p>
                            </div>
                            <div className={styles.avatarCircle}>
                                MG
                            </div>
                        </div>
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
