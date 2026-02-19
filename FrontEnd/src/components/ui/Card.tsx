import React from 'react';
import styles from './Card.module.css';

// INTERFAZ DE PROPS PARA EL COMPONENTE CARD
interface CardProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
}

// COMPONENTE CARD PRINCIPAL
export const Card: React.FC<CardProps> = ({ children, className = '', onClick }) => {
    return (
        <div className={`${styles.card} ${className}`} onClick={onClick}>
            {children}
        </div>
    );
};

// COMPONENTE HEADER DE CARD
interface CardHeaderProps {
    title: string;
    icon?: string;
    subtitle?: string; // Opcional
    children?: React.ReactNode; // Para botones o controles extra a la derecha
}

export const CardHeader: React.FC<CardHeaderProps> = ({ title, icon, children }) => {
    return (
        <div className={styles.header}>
            <div className={styles.titleGroup}>
                {icon && <span className="material-icons">{icon}</span>}
                <h3 className={styles.title}>{title}</h3>
            </div>
            {children && <div>{children}</div>}
        </div>
    );
};

// COMPONENTE CONTENIDO DE CARD
interface CardContentProps {
    children: React.ReactNode;
    className?: string;
    padded?: boolean; // Opción para agregar padding estándar
}

export const CardContent: React.FC<CardContentProps> = ({ children, className = '', padded = false }) => {
    return (
        <div className={`${styles.content} ${padded ? styles.paddedContent : ''} ${className}`}>
            {children}
        </div>
    );
};
