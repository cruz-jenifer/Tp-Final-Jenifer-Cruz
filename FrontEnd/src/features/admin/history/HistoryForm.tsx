
import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { crearHistorial, actualizarHistorial } from '../../../store/slices/vetSlice';
import { obtenerMascotasAdmin as fetchMascotas } from '../../../store/slices/adminSlice';
import type { Historial } from '../../../store/slices/adminSlice';
import styles from '../owners/OwnerForm.module.css'; // Reusamos estilos

interface HistoryFormProps {
    isOpen: boolean;
    onClose: () => void;
    initialData: Historial | null;
}

const HistoryForm: React.FC<HistoryFormProps> = ({ isOpen, onClose, initialData }) => {
    const dispatch = useAppDispatch();
    const { mascotas, cargando } = useAppSelector((state) => state.admin);

    const [formData, setFormData] = useState({
        mascota_id: '',
        fecha: '',
        diagnostico: '',
        tratamiento: ''
    });

    useEffect(() => {
        dispatch(fetchMascotas());
    }, [dispatch]);

    useEffect(() => {
        if (initialData) {
            setFormData({
                mascota_id: initialData.mascota_id.toString(),
                fecha: initialData.fecha ? initialData.fecha.split('T')[0] : '',
                diagnostico: initialData.diagnostico,
                tratamiento: initialData.tratamiento
            });
        } else {
            setFormData({
                mascota_id: '',
                fecha: new Date().toISOString().split('T')[0],
                diagnostico: '',
                tratamiento: ''
            });
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const payload = {
            ...formData,
            mascota_id: Number(formData.mascota_id)
        };

        if (initialData) {
            await dispatch(actualizarHistorial({ id: initialData.id, datos: payload }));
        } else {
            await dispatch(crearHistorial(payload));
        }
        onClose();
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <div className={styles.header}>
                    <h2>{initialData ? 'Editar Historial' : 'Nuevo Registro Médico'}</h2>
                    <button onClick={onClose} className={styles.closeButton}>×</button>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label>Mascota</label>
                        <select
                            name="mascota_id"
                            value={formData.mascota_id}
                            onChange={handleChange}
                            required
                            disabled={!!initialData} // No cambiar mascota en edición para simplificar
                        >
                            <option value="">Seleccionar Paciente</option>
                            {mascotas.map(pet => (
                                <option key={pet.id} value={pet.id}>
                                    {pet.nombre} ({pet.especie}) - Dueño: {pet.dueno_nombre} {pet.dueno_apellido}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.formGroup}>
                        <label>Fecha</label>
                        <input
                            type="date"
                            name="fecha"
                            value={formData.fecha}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Diagnóstico</label>
                        <input
                            type="text"
                            name="diagnostico"
                            value={formData.diagnostico}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Tratamiento</label>
                        <textarea
                            name="tratamiento"
                            value={formData.tratamiento}
                            onChange={handleChange}
                            className={styles.inputField}
                            rows={3}
                            required
                        />
                    </div>



                    <div className={styles.actions}>
                        <button type="button" onClick={onClose} className={styles.cancelButton}>
                            Cancelar
                        </button>
                        <button type="submit" className={styles.saveButton} disabled={cargando}>
                            {cargando ? 'Guardando...' : 'Guardar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default HistoryForm;
