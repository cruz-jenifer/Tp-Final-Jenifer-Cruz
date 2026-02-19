// VALIDADORES DE FORMULARIO

// VALIDAR CAMPO REQUERIDO
export const isRequired = (valor: string): string | null => {
    if (!valor || valor.trim().length === 0) {
        return 'Este campo es obligatorio';
    }
    return null;
};

// VALIDAR FORMATO DE EMAIL
export const isValidEmail = (email: string): string | null => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !regex.test(email)) {
        return 'Ingrese un email válido';
    }
    return null;
};

// VALIDAR LARGO MINIMO
export const minLength = (valor: string, largo: number): string | null => {
    if (valor && valor.trim().length < largo) {
        return `Debe tener al menos ${largo} caracteres`;
    }
    return null;
};

// VALIDAR FORMATO DE TELEFONO
export const isValidPhone = (telefono: string): string | null => {
    const regex = /^[0-9+\-() ]{7,20}$/;
    if (telefono && !regex.test(telefono)) {
        return 'Ingrese un teléfono válido';
    }
    return null;
};
