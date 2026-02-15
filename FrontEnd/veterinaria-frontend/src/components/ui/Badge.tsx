import React from 'react';
import styles from './Badge.module.css';

// TIPOS DE VARIANTE PARA EL BADGE
export type BadgeVariant = 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'secondary';

interface BadgeProps {
    text: string;
    variant?: BadgeVariant;
    className?: string;
}

// COMPONENTE BADGE PARA MOSTRAR ESTADOS
export const Badge: React.FC<BadgeProps> = ({ text, variant = 'primary', className = '' }) => {
    return (
        <span className={`${styles.badge} ${styles[variant]} ${className}`}>
            {text}
        </span>
    );
};
