import React from 'react';
import { Modal } from './Modal';
import styles from './ConfirmationModal.module.css';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    titulo: string;
    mensaje: string;
    textoConfirmar?: string;
    textoCancelar?: string;
    esPeligroso?: boolean;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    titulo,
    mensaje,
    textoConfirmar = 'Confirmar',
    textoCancelar = 'Cancelar',
    esPeligroso = false
}) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} titulo={titulo}>
            <div className={styles.container}>
                <p className={styles.message}>{mensaje}</p>
                <div className={styles.actions}>
                    <button className={styles.cancelButton} onClick={onClose}>
                        {textoCancelar}
                    </button>
                    <button
                        className={`${styles.confirmButton} ${esPeligroso ? styles.danger : ''}`}
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                    >
                        {textoConfirmar}
                    </button>
                </div>
            </div>
        </Modal>
    );
};
