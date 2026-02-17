import React from 'react';
import styles from './Input.module.css'; // Reutilizar estilos de input para consistencia

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
}

export const Textarea: React.FC<TextareaProps> = ({ label, error, className, ...props }) => {
    return (
        <div className={styles.inputContainer}>
            {label && (
                <label className={styles.label} htmlFor={props.id}>
                    {label}
                </label>
            )}
            <textarea
                className={`${styles.input} ${error ? styles.errorInput : ''} ${className || ''}`}
                style={{ minHeight: '100px', resize: 'vertical' }}
                {...props}
            />
            {error && <span className={styles.errorMessage}>{error}</span>}
        </div>
    );
};
