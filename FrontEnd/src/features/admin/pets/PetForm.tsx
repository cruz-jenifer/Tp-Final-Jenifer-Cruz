import React from 'react';
import { usePetForm } from '../hooks/usePetForm';
import { useAppSelector } from '../../../store/hooks';
import { usePets } from '../hooks/usePets';
import TarjetaRegistro from '../../../components/ui/RegisterCard';
import styles from './PetsPage.module.css';
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

    const { razas } = useAppSelector(state => state.admin);
    const { todosLosDuenos } = usePets();

    return (
        <TarjetaRegistro
            titulo={petToEdit ? 'Editar Mascota' : 'Registrar Nueva Mascota'}
            icono={petToEdit ? 'edit' : 'pets'}
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
                    <label htmlFor="raza_id">Raza</label>
                    <select
                        name="raza_id"
                        id="raza_id"
                        value={formData.raza_id}
                        onChange={handleChange}
                        className={`${styles.inputField} ${errors.raza_id ? styles.inputError : ''}`}
                    >
                        <option value="">Seleccionar Raza</option>
                        {razas
                            .filter(r => {
                                if (formData.especie === 'Perro') return r.especie_id === 1;
                                if (formData.especie === 'Gato') return r.especie_id === 2;
                                if (formData.especie === 'Otro') return r.especie_id === 3;
                                return true;
                            })
                            .sort((a, b) => {
                                const isGenericA = a.nombre === 'Mestizo' || a.nombre === 'Otras especies';
                                const isGenericB = b.nombre === 'Mestizo' || b.nombre === 'Otras especies';
                                if (isGenericA && !isGenericB) return -1;
                                if (!isGenericA && isGenericB) return 1;
                                return a.nombre.localeCompare(b.nombre);
                            })
                            .map(r => (
                                <option key={r.id} value={r.id}>
                                    {r.nombre}
                                </option>
                            ))
                        }
                        {razas.length === 0 && <option disabled>Cargando razas...</option>}
                    </select>
                    {errors.raza_id && <span className={styles.errorMessage}>{errors.raza_id}</span>}
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
                        {todosLosDuenos.map((owner: any) => (
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
                            disabled={isSubmitting || !formData.nombre || !formData.raza_id || !formData.fecha_nacimiento || !formData.dueno_id}
                            className={styles.addButton}
                            style={{ opacity: (isSubmitting || !formData.nombre || !formData.raza_id || !formData.fecha_nacimiento || !formData.dueno_id) ? 0.7 : 1 }}
                        >
                            <span className="material-icons">{petToEdit ? 'save' : 'add'}</span>
                            {isSubmitting ? 'Guardando...' : (petToEdit ? 'Guardar Cambios' : 'Agregar Mascota')}
                        </button>
                    </div>
                </div>
            </form>
        </TarjetaRegistro>
    );
};
