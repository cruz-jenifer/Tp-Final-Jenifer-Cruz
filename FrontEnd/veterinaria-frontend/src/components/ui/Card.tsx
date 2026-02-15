import React from 'react';
import styles from './Card.module.css';

// INTERFAZ DE PROPS PARA EL COMPONENTE CARD
interface CardProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
}

// COMPONENTE CARD REUTILIZABLE
export const Card: React.FC<CardProps> = ({ children, className = '', onClick }) => {
    return (
        <div
            className={`${styles.card} ${className}`}
            onClick={onClick}
        >
            {children}
        </div>
    );
};
