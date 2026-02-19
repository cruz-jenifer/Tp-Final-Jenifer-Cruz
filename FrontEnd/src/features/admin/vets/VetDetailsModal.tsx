import React from 'react';
import type { Veterinario } from '../../../store/slices/adminSlice';
import styles from './VetDetailsModal.module.css';

interface VetDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    vet: Veterinario | null;
}

const VetDetailsModal: React.FC<VetDetailsModalProps> = ({ isOpen, onClose, vet }) => {
    if (!isOpen || !vet) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <button
                    onClick={onClose}
                    className={styles.closeButton}
                >
                    <span className="material-icons">close</span>
                </button>

                <div className={styles.header}>
                    <div className={styles.iconCircle}>
                        <span className="material-icons" style={{ fontSize: '2rem' }}>medical_services</span>
                    </div>
                    <h3 className={styles.title}>Detalles del Veterinario</h3>
                    <div className={styles.badge}>
                        {vet.especialidad || 'Veterinario General'}
                    </div>
                </div>

                <div className={styles.detailsList}>
                    <div className={styles.detailRow}>
                        <span className={styles.detailLabel}>Nombre Completo</span>
                        <span className={styles.detailValue}>{vet.nombre} {vet.apellido}</span>
                    </div>
                    <div className={styles.detailRow}>
                        <span className={styles.detailLabel}>Email</span>
                        <span className={styles.detailValue}>{vet.email || 'No registrado'}</span>
                    </div>
                    <div className={styles.detailRow}>
                        <span className={styles.detailLabel}>Matrícula</span>
                        <span className={styles.detailValue}>{vet.matricula || 'N/A'}</span>
                    </div>
                    <div className={styles.detailRow}>
                        <span className={styles.detailLabel}>ID Sistema</span>
                        <span className={styles.detailValue} style={{ fontFamily: 'monospace' }}>#{vet.id}</span>
                    </div>

                    {vet.clave_temporal && (
                        <div className={styles.passwordBox}>
                            <div className={styles.passwordHeader}>
                                <span className="material-icons" style={{ fontSize: '1rem' }}>vpn_key</span>
                                <span>Contraseña Inicial</span>
                            </div>
                            <div className={styles.passwordDisplay}>
                                {vet.clave_temporal}
                            </div>
                            <p className={styles.warningText}>
                                Contraseña de único acceso, el veterinario debe modificar la contraseña una vez ingresado.
                            </p>
                        </div>
                    )}
                </div>

                <div className={styles.footer}>
                    <button
                        onClick={onClose}
                        className={styles.actionButton}
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VetDetailsModal;
