import React from 'react';
import { usePetForm } from '../hooks/usePetForm';
import { usePets } from '../hooks/usePets'; // Para obtener owners (o pasarlos por props)
import RegisterCard from '../../../components/ui/RegisterCard';
import styles from './PetsPage.module.css'; // Usamos estilos unificados
import type { Mascota } from '../../../store/slices/adminSlice';

interface PetFormProps {
    petToEdit?: Mascota | null;
    onCancelEdit?: () => void;
    onSuccess?: () => void;
}

export const PetForm: React.FC<PetFormProps> = ({ petToEdit, onCancelEdit, onSuccess }) => {
    const {
        formData,
        errors,
        isSubmitting,
        handleChange,
        handleSubmit
    } = usePetForm(petToEdit, onSuccess);

    // Necesitamos la lista de dueños para el select
    // Podemos reusar el hook usePets o pasarlo como prop. 
    // Reusarlo aquí es práctico, aunque fetchDuenos se llama dos veces (cacheado por Redux idealmente)
    const { allOwners } = usePets();

    return (
        <RegisterCard
            title={petToEdit ? 'Editar Mascota' : 'Registrar Nueva Mascota'}
            icon={petToEdit ? 'edit' : 'pets'}
        >
            <form onSubmit={handleSubmit} className={styles.formGrid}>
                {/* Nombre */}
                <div className={styles.inputGroup}>
                    <label htmlFor="nombre">Nombre</label>
                    <input
                        type="text"
                        name="nombre"
                        id="nombre"
                        placeholder="Ej: Firulais"
                        value={formData.nombre}
                        onChange={handleChange}
                        className={`${styles.inputField} ${errors.nombre ? styles.inputError : ''}`}
                    />
                    {errors.nombre && <span className={styles.errorMessage}>{errors.nombre}</span>}
                </div>

                {/* Especie */}
                <div className={styles.inputGroup}>
                    <label htmlFor="especie">Especie</label>
                    <select
                        name="especie"
                        id="especie"
                        value={formData.especie}
                        onChange={handleChange}
                        className={styles.inputField}
                    >
                        <option value="Perro">Perro</option>
                        <option value="Gato">Gato</option>
                        <option value="Otro">Otro</option>
                    </select>
                </div>

                {/* Raza */}
                <div className={styles.inputGroup}>
                    <label htmlFor="raza">Raza</label>
                    <input
                        type="text"
                        name="raza"
                        id="raza"
                        placeholder="Ej: Caniche"
                        value={formData.raza}
                        onChange={handleChange}
                        className={`${styles.inputField} ${errors.raza ? styles.inputError : ''}`}
                    />
                    {errors.raza && <span className={styles.errorMessage}>{errors.raza}</span>}
                </div>

                {/* Fecha Nacimiento */}
                <div className={styles.inputGroup}>
                    <label htmlFor="fecha_nacimiento">Fecha Nacimiento</label>
                    <input
                        type="date"
                        name="fecha_nacimiento"
                        id="fecha_nacimiento"
                        value={formData.fecha_nacimiento}
                        onChange={handleChange}
                        className={`${styles.inputField} ${errors.fecha_nacimiento ? styles.inputError : ''}`}
                    />
                    {errors.fecha_nacimiento && <span className={styles.errorMessage}>{errors.fecha_nacimiento}</span>}
                </div>

                {/* Dueño */}
                <div className={styles.inputGroup}>
                    <label htmlFor="dueno_id">Dueño</label>
                    <select
                        name="dueno_id"
                        id="dueno_id"
                        value={formData.dueno_id}
                        onChange={handleChange}
                        className={`${styles.inputField} ${errors.dueno_id ? styles.inputError : ''}`}
                    >
                        <option value="">Seleccionar Dueño</option>
                        {allOwners.map(owner => (
                            <option key={owner.id} value={owner.id}>
                                {owner.nombre} {owner.apellido} (DNI: {owner.dni || 'N/A'})
                            </option>
                        ))}
                    </select>
                    {errors.dueno_id && <span className={styles.errorMessage}>{errors.dueno_id}</span>}
                </div>

                {/* Botones */}
                <div className={styles.inputGroup}>
                    <div className={styles.actionButtonContainer}>
                        {petToEdit && (
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
                            <span className="material-icons">{petToEdit ? 'save' : 'add'}</span>
                            {isSubmitting ? 'Guardando...' : (petToEdit ? 'Guardar Cambios' : 'Agregar Mascota')}
                        </button>
                    </div>
                </div>
            </form>
        </RegisterCard>
    );
};
