import { useState, useRef } from 'react';
import { useAppDispatch } from '../../../store/hooks';
import { crearVeterinario, actualizarVeterinario, type Veterinario } from '../../../store/slices/adminSlice';

export const useVetForm = () => {
    const dispatch = useAppDispatch();
    const referenciaFormulario = useRef<HTMLDivElement>(null);

    const [datosFormulario, setDatosFormulario] = useState({
        id: undefined as number | undefined,
        nombre: '',
        apellido: '',
        email: '',
        matricula: ''
    });

    const [editando, setEditando] = useState(false);

    const manejarCambio = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setDatosFormulario(prev => ({ ...prev, [name]: value }));
    };

    const resetearFormulario = () => {
        setDatosFormulario({ id: undefined, nombre: '', apellido: '', email: '', matricula: '' });
        setEditando(false);
    };

    const manejarEnvio = async (alExito?: (vet: Veterinario) => void) => {
        if (!datosFormulario.nombre || !datosFormulario.apellido || !datosFormulario.email || !datosFormulario.matricula) return alert('COMPLETE TODOS LOS CAMPOS');

        if (editando && datosFormulario.id) {
            await dispatch(actualizarVeterinario({ id: datosFormulario.id, datos: datosFormulario }));
            resetearFormulario();
        } else {
            try {
                const resultado = await dispatch(crearVeterinario(datosFormulario)).unwrap();
                if (resultado.clave_temporal) {
                    // ALERT DE CLAVE TEMPORAL (OPCIONAL)
                    if (alExito) alExito(resultado);
                } else if (alExito) {
                    alExito(resultado);
                }
                resetearFormulario();
            } catch (err: unknown) {
                const mensaje = err instanceof Error ? err.message : String(err);
                alert(`ERROR: ${mensaje}`);
                return;
            }
        }
    };

    const manejarEdicion = (vet: Veterinario) => {
        setDatosFormulario({
            id: vet.id,
            nombre: vet.nombre,
            apellido: vet.apellido,
            email: vet.email || '',
            matricula: vet.matricula || ''
        });
        setEditando(true);
        referenciaFormulario.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };

    return {
        datosFormulario,
        editando,
        referenciaFormulario,
        manejarCambio,
        manejarEnvio,
        manejarEdicion,
        resetearFormulario
    };
};
