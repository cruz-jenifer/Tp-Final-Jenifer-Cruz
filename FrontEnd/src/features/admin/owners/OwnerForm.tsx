import React from 'react';
import { useOwnerForm } from '../hooks/useOwnerForm';
import RegisterCard from '../../../components/ui/RegisterCard';
import styles from './OwnersPage.module.css'; // Usamos los estilos unificados
import type { Owner } from '../../../store/slices/adminSlice';

interface OwnerFormProps {
    ownerToEdit?: Owner | null;
    onCancelEdit?: () => void;
    onSuccess?: () => void;
}

export const OwnerForm: React.FC<OwnerFormProps> = ({ ownerToEdit, onCancelEdit, onSuccess }) => {
    const {
        formData,
        errors,
        isSubmitting,
        handleChange,
        handleSubmit
    } = useOwnerForm(ownerToEdit, onSuccess);

    return (
        <RegisterCard
            title={ownerToEdit ? 'Editar Dueño' : 'Registrar Nuevo Dueño'}
            icon="person_add"
        >
            <form onSubmit={handleSubmit} className={styles.formGrid}>
                {/* Nombre */}
                <div className={styles.inputGroup}>
                    <label htmlFor="nombre">Nombre</label>
                    <input
                        type="text"
                        name="nombre"
                        id="nombre"
                        placeholder="Ej: Juan"
                        value={formData.nombre}
                        onChange={handleChange}
                        className={`${styles.inputField} ${errors.nombre ? styles.inputError : ''}`}
                    />
                    {errors.nombre && <span className={styles.errorMessage}>{errors.nombre}</span>}
                </div>

                {/* Apellido */}
                <div className={styles.inputGroup}>
                    <label htmlFor="apellido">Apellido</label>
                    <input
                        type="text"
                        name="apellido"
                        id="apellido"
                        placeholder="Ej: Pérez"
                        value={formData.apellido}
                        onChange={handleChange}
                        className={`${styles.inputField} ${errors.apellido ? styles.inputError : ''}`}
                    />
                    {errors.apellido && <span className={styles.errorMessage}>{errors.apellido}</span>}
                </div>

                {/* Email */}
                <div className={styles.inputGroup}>
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        placeholder="correo@ejemplo.com"
                        value={formData.email}
                        onChange={handleChange}
                        className={`${styles.inputField} ${errors.email ? styles.inputError : ''}`}
                        disabled={!!ownerToEdit}
                    />
                    {errors.email && <span className={styles.errorMessage}>{errors.email}</span>}
                </div>

                {/* Teléfono */}
                <div className={styles.inputGroup}>
                    <label htmlFor="telefono">Teléfono</label>
                    <input
                        type="tel"
                        name="telefono"
                        id="telefono"
                        placeholder="Ej: 11 1234 5678"
                        value={formData.telefono}
                        onChange={handleChange}
                        className={`${styles.inputField} ${errors.telefono ? styles.inputError : ''}`}
                    />
                    {errors.telefono && <span className={styles.errorMessage}>{errors.telefono}</span>}
                </div>

                {/* DNI */}
                <div className={styles.inputGroup}>
                    <label htmlFor="dni">DNI (Opcional)</label>
                    <input
                        type="text"
                        name="dni"
                        id="dni"
                        placeholder="Ej: 12345678"
                        value={formData.dni}
                        onChange={handleChange}
                        className={`${styles.inputField} ${errors.dni ? styles.inputError : ''}`}
                    />
                    {errors.dni && <span className={styles.errorMessage}>{errors.dni}</span>}
                </div>

                {/* Botones */}
                <div className={styles.inputGroup}>
                    <div className={styles.actionButtonContainer}>
                        {ownerToEdit && (
                            <button
                                type="button"
                                onClick={onCancelEdit}
                                className={styles.cancelButton}
                                title="Cancelar Edición"
                            >
                                <span className="material-icons">close</span>
                            </button>
                        )}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={styles.addButton}
                            style={{ opacity: isSubmitting ? 0.7 : 1 }}
                        >
                            <span className="material-icons">{ownerToEdit ? 'save' : 'add'}</span>
                            {isSubmitting ? 'Guardando...' : (ownerToEdit ? 'Guardar Cambios' : 'Agregar Dueño')}
                        </button>
                    </div>
                </div>
            </form>
        </RegisterCard>
    );
};
