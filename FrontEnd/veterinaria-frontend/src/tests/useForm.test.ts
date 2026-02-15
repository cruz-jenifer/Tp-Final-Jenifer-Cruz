import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useForm } from '../hooks/useForm';

describe('Hook useForm', () => {
    const initialState = {
        email: '',
        password: ''
    };

    const validations = {
        email: { required: true, email: true },
        password: { required: true, minLength: 5 }
    };

    it('debería inicializar con valores por defecto', () => {
        const { result } = renderHook(() => useForm(initialState, validations));
        expect(result.current.values).toEqual(initialState);
        expect(result.current.errors).toEqual({});
    });

    it('debería actualizar valores al cambiar', () => {
        const { result } = renderHook(() => useForm(initialState, validations));

        act(() => {
            const event = {
                target: { name: 'email', value: 'test@test.com' }
            } as React.ChangeEvent<HTMLInputElement>;
            result.current.handleChange(event);
        });

        expect(result.current.values.email).toBe('test@test.com');
    });

    it('debería validar formato de email', () => {
        const { result } = renderHook(() => useForm(initialState, validations));

        act(() => {
            const event = {
                target: { name: 'email', value: 'invalid-email' }
            } as React.ChangeEvent<HTMLInputElement>;
            result.current.handleChange(event);
        });

        expect(result.current.errors.email).toBe('Email inválido');
    });

    it('debería retornar false si el formulario es inválido', async () => {
        const { result } = renderHook(() => useForm(initialState, validations));

        let isValid;
        await act(async () => {
            isValid = result.current.isValid();
        });

        expect(isValid).toBe(false);
        // LA ACTUALIZACION DE ESTADO PUEDE AGRUPARSE, VERIFICAMOS SI LOS ERRORES SE ACTUALIZAN
        expect(result.current.errors.email).toBe('Este campo es requerido');
    });

    it('debería retornar true si el formulario es válido', () => {
        const { result } = renderHook(() => useForm(initialState, validations));

        act(() => {
            result.current.handleChange({ target: { name: 'email', value: 'test@example.com' } } as any);
            result.current.handleChange({ target: { name: 'password', value: '12345' } } as any);
        });

        let isValid;
        act(() => {
            isValid = result.current.isValid();
        });

        expect(isValid).toBe(true);
    });
});
