import React from 'react';
import styles from './Button.module.css';

export type ButtonVariant = 'primary' | 'success' | 'secondary' | 'danger';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    icon?: string;
    loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    icon,
    loading = false,
    className = '',
    disabled,
    ...props
}) => {
    return (
        <button
            className={`${styles.button} ${styles[variant]} ${className}`}
            disabled={disabled || loading}
            {...props}
        >
            {loading && <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" style={{ width: '1rem', height: '1rem', borderWidth: '2px' }}></span>}
            {!loading && icon && <span className="material-icons" style={{ fontSize: '1.25rem' }}>{icon}</span>}
            {children}
        </button>
    );
};
