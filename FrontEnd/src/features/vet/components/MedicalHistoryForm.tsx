import { useState, useEffect } from 'react';
import { useAppDispatch } from '../../../store/hooks';
import { crearHistorial } from '../../../store/slices/vetSlice';
import type { AgendaItem } from '../../../types/historial.types';
import styles from './MedicalHistoryForm.module.css';
import vet from './VetComponents.module.css';
import { Card, CardHeader, CardContent } from '../../../components/ui/Card';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';

interface MedicalHistoryFormProps {
    turno?: AgendaItem | null;
    onSuccess: () => void;
}

export const MedicalHistoryForm = ({ turno, onSuccess }: MedicalHistoryFormProps) => {
    const dispatch = useAppDispatch();
    const [diagnostico, setDiagnostico] = useState('');
    const [tratamiento, setTratamiento] = useState('');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // LIMPIAR FORMULARIO CUANDO CAMBIA EL TURNO
    useEffect(() => {
        setDiagnostico('');
        setTratamiento('');

        setError(null);
    }, [turno]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!turno) return;

        setLoading(true);
        setError(null);

        try {
            await dispatch(crearHistorial({
                mascota_id: turno.mascota_id,
                diagnostico,
                tratamiento
            })).unwrap();

            setLoading(false);
            onSuccess();
            alert('Historial guardado correctamente');
        } catch (err: unknown) {
            setLoading(false);
            const message = err instanceof Error ? err.message : String(err);
            setError(message || 'Error al guardar');
        }
    };

    return (
        <Card className={styles.cardOverride}>
            <CardHeader
                title="Crear Nueva Entrada Clínica"
                icon="edit_note"
            />

            <CardContent>
                {error && <div className={styles.errorAlert}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className={styles.formRow}>
                        {/* MASCOTA ID */}
                        <div className={vet.flexFixed160}>
                            <Input
                                label="Mascota ID"
                                value={turno ? `#PET-${turno.mascota_id}` : ''}
                                disabled
                                icon="search"
                                readOnly
                            />
                        </div>

                        {/* FECHA CONSULTA */}
                        <div className={vet.flexFixed180}>
                            <Input
                                label="Fecha Consulta"
                                type="date"
                                value={new Date().toISOString().split('T')[0]}
                                disabled
                            />
                        </div>

                        {/* DIAGNOSTICO */}
                        <div className={styles.formGroupFlex}>
                            <Input
                                label="Diagnóstico / Procedimiento"
                                placeholder="Ej: Gastritis leve, se receta dieta blanda"
                                value={diagnostico}
                                onChange={(e) => setDiagnostico(e.target.value)}
                                required
                                disabled={!turno}
                            />
                        </div>

                        {/* BOTON GUARDAR */}
                        <div className={vet.flexFixedAuto}>
                            <Button
                                type="submit"
                                variant="success"
                                loading={loading}
                                disabled={loading || !turno}
                                icon="save"
                            >
                                Guardar
                            </Button>
                        </div>
                    </div>

                    {/* CAMPOS EXTRA (SE MUESTRAN AL SELECCIONAR TURNO) */}
                    {turno && (
                        <div className={styles.extraFields}>
                            <div className={styles.formGroupFlex}>
                                <Input
                                    label="Tratamiento"
                                    placeholder="Describa el tratamiento indicado..."
                                    value={tratamiento}
                                    onChange={(e) => setTratamiento(e.target.value)}
                                    required
                                />
                            </div>

                        </div>
                    )}
                </form>
            </CardContent>
        </Card>
    );
};
