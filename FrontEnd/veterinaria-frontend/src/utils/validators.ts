export const isRequired = (value: any): string | null => {
    if (value === null || value === undefined || value === '') {
        return 'Este campo es requerido';
    }
    return null;
};

export const isValidEmail = (email: string): string | null => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(email)) {
        return 'Formato de email inválido';
    }
    return null;
};

export const hasErrors = (errors: { [key: string]: string | null }): boolean => {
    return Object.values(errors).some(error => error !== null);
};
