import React from 'react';
import styles from './ActionBtn.module.css';

export type ActionBtnVariant = 'primary' | 'success' | 'danger' | 'secondary';

interface ActionBtnProps {
    onClick: () => void;
    icon: string;
    label?: string;
    variant?: ActionBtnVariant;
    title?: string;
    className?: string;
}

export const ActionBtn: React.FC<ActionBtnProps> = ({
    onClick,
    icon,
    label,
    variant = 'secondary',
    title,
    className = ''
}) => {
    return (
        <button
            className={`${styles.btn} ${styles[variant]} ${!label ? styles.iconOnly : ''} ${className}`}
            onClick={onClick}
            title={title}
        >
            <span className="material-icons" style={{ fontSize: '16px' }}>{icon}</span>
            {label && <span>{label}</span>}
        </button>
    );
};
