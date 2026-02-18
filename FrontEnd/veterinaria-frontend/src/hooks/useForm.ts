import { useState } from 'react';
import type { ChangeEvent } from 'react';

// TIPOS DE VALIDACION
type ValidationRules = {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    email?: boolean;
};

type Validations<T> = Partial<Record<keyof T, ValidationRules>>;
type Errors<T> = Partial<Record<keyof T, string>>;

// HOOK PERSONALIZADO PARA FORMULARIOS
export const useForm = <T extends Record<string, string>>(initialState: T, validations: Validations<T> = {}) => {
    const [values, setValues] = useState<T>(initialState);
    const [errors, setErrors] = useState<Errors<T>>({});

    const validate = (name: keyof T, value: T[keyof T]): string => {
        const rules = validations[name];
        if (!rules) return '';

        if (rules.required && !value) {
            return 'Este campo es requerido';
        }

        if (rules.minLength && String(value).length < rules.minLength) {
            return `Mínimo ${rules.minLength} caracteres`;
        }

        if (rules.maxLength && String(value).length > rules.maxLength) {
            return `Máximo ${rules.maxLength} caracteres`;
        }

        if (rules.email && !/\S+@\S+\.\S+/.test(value)) {
            return 'Email inválido';
        }

        return '';
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setValues((prev) => ({
            ...prev,
            [name]: value,
        }));

        const error = validate(name, value as T[keyof T]);
        setErrors((prev) => ({
            ...prev,
            [name]: error,
        }));
    };

    const isValid = () => {
        const newErrors: Errors<T> = {};
        let valid = true;

        for (const key in values) {
            const error = validate(key, values[key]);
            if (error) {
                newErrors[key] = error;
                valid = false;
            }
        }

        setErrors(newErrors);
        return valid;
    };

    return {
        values,
        errors,
        handleChange,
        isValid,
    };
};
