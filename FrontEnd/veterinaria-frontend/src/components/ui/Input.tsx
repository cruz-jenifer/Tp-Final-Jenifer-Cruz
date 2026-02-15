import React from 'react';
import type { InputHTMLAttributes } from 'react';
import styles from './Input.module.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
}

// COMPONENTE INPUT REUTILIZABLE
export const Input: React.FC<InputProps> = ({ label, error, className, ...props }) => {
    return (
        <div className={styles.inputContainer}>
            <label className={styles.label} htmlFor={props.id}>
                {label}
            </label>
            <input
                className={`${styles.input} ${error ? styles.errorInput : ''} ${className || ''}`}
                {...props}
            />
            {error && <span className={styles.errorMessage}>{error}</span>}
        </div>
    );
};
