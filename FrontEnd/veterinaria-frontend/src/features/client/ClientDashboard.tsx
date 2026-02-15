import React from 'react';
import { MascotasList } from './components/MascotasList';
import { TurnosList } from './components/TurnosList';
import styles from './ClientDashboard.module.css';

// DASHBOARD PRINCIPAL DEL CLIENTE
const ClientDashboard: React.FC = () => {
    return (
        <div className={styles.container}>
            {/* NAVBAR SIMPLIFICADA */}
            <nav className={styles.header}>
                <div className={styles.welcome}>
                    <span>PATITAS FELICES - PORTAL DUEÑOS</span>
                </div>
                <div>
                    {/* INFORMACION DE USUARIO MOCKEADA */}
                    <div style={{ textAlign: 'right' }}>
                        <p style={{ margin: 0, fontSize: '0.8rem' }}>Bienvenida,</p>
                        <p style={{ margin: 0, fontWeight: 'bold' }}>María González</p>
                    </div>
                </div>
            </nav>

            <main>
                {/* SECCION DE TURNOS */}
                <section id="turnos" className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <div>
                            <h2 className={styles.sectionTitle}>Próximos Turnos</h2>
                            <p className={styles.sectionSubtitle}>Agenda de visitas veterinarias</p>
                        </div>
                        <button className={styles.primaryButton}>
                            PEDIR TURNO
                        </button>
                    </div>

                    {/* TARJETA DE RESUMEN DE PROXIMA VISITA */}
                    <div style={{ marginBottom: '1rem', padding: '1rem', border: '1px solid #ccc', borderRadius: '8px' }}>
                        <strong>MIS CITAS AGENDADAS</strong>
                        <span style={{ float: 'right', background: '#e0e7ff', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.9rem' }}>
                            Próxima visita: Mañana, 10:30 AM
                        </span>
                    </div>

                    <TurnosList />
                </section>

                {/* SECCION DE MASCOTAS */}
                <section id="mascotas" className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <div>
                            <h2 className={styles.sectionTitle}>Mis Mascotas</h2>
                            <p className={styles.sectionSubtitle}>Fichas de tus compañeros peludos</p>
                        </div>
                    </div>

                    <MascotasList />
                </section>
            </main>
        </div>
    );
};

export default ClientDashboard;
