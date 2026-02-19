import React from 'react';
import type { InputHTMLAttributes } from 'react';
import styles from './Input.module.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    icon?: string;
}

// COMPONENTE INPUT REUTILIZABLE
export const Input: React.FC<InputProps> = ({ label, error, icon, className, ...props }) => {
    return (
        <div className={styles.inputContainer}>
            {label && (
                <label className={styles.label} htmlFor={props.id}>
                    {label}
                </label>
            )}
            <div className={styles.inputWrapper}>
                {icon && <span className={`material-icons ${styles.inputIcon}`}>{icon}</span>}
                <input
                    className={`${styles.input} ${icon ? styles.withIcon : ''} ${error ? styles.errorInput : ''} ${className || ''}`}
                    {...props}
                />
            </div>
            {error && <span className={styles.errorMessage}>{error}</span>}
        </div>
    );
};
