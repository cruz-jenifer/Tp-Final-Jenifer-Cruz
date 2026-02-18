
import React from 'react';
import type { Owner } from '../../../store/slices/adminSlice';
import styles from './OwnerDetailsModal.module.css';

interface OwnerDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    owner: Owner | null;
}

const OwnerDetailsModal: React.FC<OwnerDetailsModalProps> = ({ isOpen, onClose, owner }) => {
    if (!isOpen || !owner) return null;

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
                        <span className="material-icons" style={{ fontSize: '2rem' }}>badge</span>
                    </div>
                    <h3 className={styles.title}>Detalles del Dueño</h3>
                    <p className={styles.subtitle}>Información completa de registro</p>
                </div>

                <div className={styles.detailsList}>
                    <div className={styles.detailRow}>
                        <span className={styles.detailLabel}>Nombre Completo</span>
                        <span className={styles.detailValue}>{owner.nombre} {owner.apellido}</span>
                    </div>
                    <div className={styles.detailRow}>
                        <span className={styles.detailLabel}>Email</span>
                        <span className={styles.detailValue}>{owner.email}</span>
                    </div>
                    <div className={styles.detailRow}>
                        <span className={styles.detailLabel}>Teléfono</span>
                        <span className={styles.detailValue}>{owner.telefono}</span>
                    </div>
                    <div className={styles.detailRow}>
                        <span className={styles.detailLabel}>DNI</span>
                        <span className={styles.detailValue}>{owner.dni || 'N/A'}</span>
                    </div>

                    {owner.clave_temporal && (
                        <div className={styles.passwordBox}>
                            <div className={styles.passwordHeader}>
                                <span className="material-icons" style={{ fontSize: '1rem' }}>vpn_key</span>
                                <span>Contraseña Inicial</span>
                            </div>
                            <div className={styles.passwordDisplay}>
                                {owner.clave_temporal}
                            </div>
                            <p className={styles.warningText}>
                                Contraseña de único acceso, el usuario debe modificar la contraseña una vez ingresado.
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

export default OwnerDetailsModal;
