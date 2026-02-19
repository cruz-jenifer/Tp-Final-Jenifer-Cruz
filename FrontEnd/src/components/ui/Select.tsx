import React, { forwardRef } from 'react';
import styles from './Input.module.css'; // Reutilizar estilos de input

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    options?: { value: string | number; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(({ label, error, className, children, options, ...props }, ref) => {
    return (
        <div className={styles.inputContainer}>
            {label && (
                <label className={styles.label} htmlFor={props.id}>
                    {label}
                </label>
            )}
            <div className={styles.inputWrapper}>
                <select
                    className={`${styles.input} ${error ? styles.errorInput : ''} ${className || ''}`}
                    ref={ref}
                    {...props}
                >
                    {children}
                    {options?.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            </div>
            {error && <span className={styles.errorMessage}>{error}</span>}
        </div>
    );
});

Select.displayName = 'Select';
