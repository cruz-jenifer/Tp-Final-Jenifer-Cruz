import React from 'react';
import { Select, type SelectProps } from './Select';

// GENERAR LISTA DE HORARIOS DISPONIBLES (08:00 - 16:30)
const GENERAR_HORARIOS = () => {
    const horarios = [];
    for (let hora = 8; hora < 17; hora++) {
        const hora_texto = hora.toString().padStart(2, '0');
        horarios.push(`${hora_texto}:00`);
        // El último turno es a las 16:30
        if (hora < 16 || (hora === 16 && 30 === 30)) {
            if (hora < 17) {
                const siguiente = `${hora_texto}:30`;
                if (siguiente <= '16:30') horarios.push(siguiente);
            }
        }
    }
    return horarios;
};

export const LISTA_HORARIOS = GENERAR_HORARIOS();

interface SelectorHorarioProps extends Omit<SelectProps, 'children'> {
    error?: string;
    fecha?: string;
    veterinarioId?: number;
}

export const SelectorHorario: React.FC<SelectorHorarioProps> = ({ label, value, onChange, error, ...props }) => {
    return (
        <Select
            label={label || "Hora *"}
            value={value}
            onChange={onChange}
            error={error}
            {...props}
        >
            <option value="">Seleccionar horario</option>
            {LISTA_HORARIOS.map(horario => (
                <option key={horario} value={horario}>
                    {horario} hs
                </option>
            ))}
        </Select>
    );
};
