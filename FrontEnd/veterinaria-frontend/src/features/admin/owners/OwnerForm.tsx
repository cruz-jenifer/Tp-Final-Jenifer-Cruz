import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createDueno, updateDueno } from '../../../store/slices/adminSlice';
import type { AppDispatch } from '../../../store';
import styles from './OwnerForm.module.css';

// PROPS DEL FORMULARIO
interface OwnerFormProps {
    ownerToEdit?: any | null; // TIPO DE DUEÑO O NULL
    onCancelEdit?: () => void; // CALLBACK PARA CANCELAR EDICION
}

// FORMULARIO DE DUEÑO (TARJETA TIPO STICH)
export const OwnerForm: React.FC<OwnerFormProps> = ({ ownerToEdit, onCancelEdit }) => {
    const dispatch = useDispatch<AppDispatch>();

    // ESTADO LOCAL DEL FORMULARIO
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        email: '',
        telefono: '',
        dni: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    // EFECTO PARA CARGAR DATOS SI ES EDICION
    useEffect(() => {
        if (ownerToEdit) {
            setFormData({
                nombre: ownerToEdit.nombre || '',
                apellido: ownerToEdit.apellido || '',
                email: ownerToEdit.email || '',
                telefono: ownerToEdit.telefono || '',
                dni: ownerToEdit.dni || ''
            });
        } else {
            // LIMPIAR FORMULARIO SI ES NUEVO
            setFormData({
                nombre: '',
                apellido: '',
                email: '',
                telefono: '',
                dni: ''
            });
        }
    }, [ownerToEdit]);

    // MANEJAR CAMBIOS EN INPUTS
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // ENVIO DEL FORMULARIO
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            if (ownerToEdit) {
                // ACTUALIZAR
                await dispatch(updateDueno({ id: ownerToEdit.id, data: formData })).unwrap();
                if (onCancelEdit) onCancelEdit();
            } else {
                // CREAR
                await dispatch(createDueno(formData)).unwrap();
                // LIMPIAR DESPUES DE CREAR
                setFormData({
                    nombre: '',
                    apellido: '',
                    email: '',
                    telefono: '',
                    dni: ''
                });
            }
        } catch (error) {
            console.error('ERROR AL GUARDAR DUEÑO:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={styles.registerCard}>
            <div className={styles.cardCircleDeco}></div>

            <h3 className={styles.cardTitle}>
                <span className="material-icons">person_add</span>
                {ownerToEdit ? 'Editar Dueño' : 'Registrar Nuevo Dueño'}
            </h3>

            <form onSubmit={handleSubmit} className={styles.formGrid}>
                <div className={styles.inputGroup}>
                    <label htmlFor="nombre">Nombre</label>
                    <input
                        type="text"
                        id="nombre"
                        name="nombre"
                        placeholder="Ej: Juan"
                        value={formData.nombre}
                        onChange={handleChange}
                        required
                        className={styles.inputField}
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label htmlFor="apellido">Apellido</label>
                    <input
                        type="text"
                        id="apellido"
                        name="apellido"
                        placeholder="Ej: Pérez"
                        value={formData.apellido}
                        onChange={handleChange}
                        required
                        className={styles.inputField}
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="correo@ejemplo.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className={styles.inputField}
                        disabled={!!ownerToEdit}
                    />
                </div>

                <div className={styles.inputGroup}>
                    {/* BOTONES DE ACCION */}
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {ownerToEdit && (
                            <button
                                type="button"
                                onClick={onCancelEdit}
                                style={{
                                    padding: '0.75rem',
                                    borderRadius: '50%',
                                    border: '1px solid #d1d5db',
                                    background: 'white',
                                    cursor: 'pointer',
                                    color: '#ef4444'
                                }}
                                title="Cancelar Edición"
                            >
                                <span className="material-icons">close</span>
                            </button>
                        )}
                        <button type="submit" disabled={isSubmitting} className={styles.addButton}>
                            <span className="material-icons">{ownerToEdit ? 'save' : 'add'}</span>
                            {isSubmitting ? 'Guardando...' : (ownerToEdit ? 'Guardar Cambios' : 'Agregar Dueño')}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};
