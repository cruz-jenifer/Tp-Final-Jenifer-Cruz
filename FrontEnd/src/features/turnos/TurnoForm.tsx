import React, { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { obtenerMascotas } from '../../store/slices/mascotasSlice';
import styles from './TurnoForm.module.css';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Textarea } from '../../components/ui/Textarea';
import { Button } from '../../components/ui/Button';
import { useTurnoForm } from './hooks/useTurnoForm';
import { SelectorHorario } from '../../components/ui/SelectorHorario';

interface TurnoFormProps {
    onSuccess?: () => void;
    onCancel?: () => void;
}

export const TurnoForm: React.FC<TurnoFormProps> = ({ onSuccess, onCancel }) => {
    const dispatch = useAppDispatch();
    const { mascotas } = useAppSelector((state) => state.mascotas);
    const formRef = useRef<HTMLFormElement>(null);
    const firstInputRef = useRef<HTMLSelectElement>(null);

    const {
        formData,
        handleChange,
        handleSubmit,
        cargando,
        es_valido
    } = useTurnoForm(onSuccess);

    useEffect(() => {
        dispatch(obtenerMascotas());
        // SCROLL AL PRIMER INPUT AL MONTAR
        if (firstInputRef.current) {
            firstInputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
            firstInputRef.current.focus();
        }
    }, [dispatch]);

    return (
        <form className={styles.form} onSubmit={handleSubmit} ref={formRef}>
            {/* SELECTOR DE MASCOTA */}
            <Select
                id="mascota_id"
                name="mascota_id"
                label="Mascota *"
                value={formData.mascota_id}
                onChange={handleChange}
                ref={firstInputRef}
                required
            >
                <option value="">Seleccione una mascota</option>
                {mascotas.map(pet => (
                    <option key={pet.id} value={pet.id}>
                        {pet.nombre} ({pet.especie})
                    </option>
                ))}
            </Select>

            <div className={styles.row}>
                <div style={{ flex: 1 }}>
                    {/* SELECTOR DE FECHA */}
                    <Input
                        label="Fecha *"
                        type="date"
                        id="fecha"
                        name="fecha"
                        value={formData.fecha}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div style={{ flex: 1 }}>
                    {/* SELECTOR DE HORA REUTILIZABLE */}
                    <SelectorHorario
                        id="hora"
                        name="hora"
                        value={formData.hora}
                        onChange={handleChange}
                        required
                    />
                </div>
            </div>

            <Select
                id="veterinario_id"
                name="veterinario_id"
                label="Veterinario (Opcional)"
                value={formData.veterinario_id}
                onChange={handleChange}
            >
                <option value="">Cualquiera disponible</option>
                <option value="1">Dr. House (General)</option>
                <option value="2">Dra. Polo (Cirugía)</option>
            </Select>

            <Textarea
                id="motivo_consulta"
                name="motivo_consulta"
                label="Motivo de consulta *"
                value={formData.motivo_consulta}
                onChange={handleChange}
                required
                rows={3}
                placeholder="Describe brevemente la razón de la visita..."
            />

            <div className={styles.actions}>
                {onCancel && (
                    <Button type="button" onClick={onCancel} variant="secondary">
                        Cancelar
                    </Button>
                )}
                {/* BOTÓN DESHABILITADO SI EL FORMULARIO ES INVÁLIDO O ESTÁ CARGANDO */}
                <Button type="submit" variant="primary" disabled={cargando || !es_valido}>
                    {cargando ? 'Confirmando...' : 'Confirmar Turno'}
                </Button>
            </div>
        </form>
    );
};
