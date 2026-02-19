import { useState } from 'react';
import type { ChangeEvent } from 'react';

// REGLAS DE VALIDACION
type ReglasValidacion = {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    email?: boolean;
};

type Validaciones<T> = Partial<Record<keyof T, ReglasValidacion>>;
type Errores<T> = Partial<Record<keyof T, string>>;

// HOOK PERSONALIZADO PARA FORMULARIOS EN ESPAÑOL
export const useForm = <T extends Record<string, string>>(estadoInicial: T, validaciones: Validaciones<T> = {}) => {
    const [valores, setValores] = useState<T>(estadoInicial);
    const [errores, setErrores] = useState<Errores<T>>({});

    const validar = (nombre: keyof T, valor: T[keyof T]): string => {
        const reglas = validaciones[nombre];
        if (!reglas) return '';

        if (reglas.required && !valor) {
            return 'Este campo es requerido';
        }

        if (reglas.minLength && String(valor).length < reglas.minLength) {
            return `Mínimo ${reglas.minLength} caracteres`;
        }

        if (reglas.maxLength && String(valor).length > reglas.maxLength) {
            return `Máximo ${reglas.maxLength} caracteres`;
        }

        if (reglas.email && !/\S+@\S+\.\S+/.test(valor)) {
            return 'Email inválido';
        }

        return '';
    };

    const manejarCambio = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setValores((prev) => ({
            ...prev,
            [name]: value,
        }));

        const error = validar(name, value as T[keyof T]);
        setErrores((prev) => ({
            ...prev,
            [name]: error,
        }));
    };

    const esValido = () => {
        const nuevosErrores: Errores<T> = {};
        let valido = true;

        for (const clave in valores) {
            const error = validar(clave, valores[clave]);
            if (error) {
                nuevosErrores[clave] = error;
                valido = false;
            }
        }

        setErrores(nuevosErrores);
        return valido;
    };

    return {
        valores,
        errores,
        manejarCambio,
        esValido,
    };
};
