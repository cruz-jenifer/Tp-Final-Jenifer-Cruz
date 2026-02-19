import { useState, useEffect } from 'react';
import { useAppDispatch } from '../../../store/hooks';
import { crearMascotaAdmin, actualizarMascotaAdmin, obtenerRazas, type Mascota } from '../../../store/slices/adminSlice';

interface DatosMascotaForm {
    nombre: string;
    especie: string;
    raza_id: string;
    fecha_nacimiento: string;
    dueno_id: string;
}

const ESTADO_INICIAL: DatosMascotaForm = {
    nombre: '',
    especie: 'Perro',
    raza_id: '',
    fecha_nacimiento: '',
    dueno_id: ''
};

// HOOK PERSONALIZADO PARA FORMULARIO DE MASCOTAS (ADMIN)
export const usePetForm = (mascotaAEditar?: Mascota | null, alTenerExito?: () => void) => {
    const despacho = useAppDispatch();
    const [datosFormulario, setDatosFormulario] = useState<DatosMascotaForm>(ESTADO_INICIAL);
    const [errores, setErrores] = useState<{ [key: string]: string }>({});
    const [estaEnviando, setEstaEnviando] = useState(false);

    useEffect(() => {
        despacho(obtenerRazas());
    }, [despacho]);

    useEffect(() => {
        if (mascotaAEditar) {
            setDatosFormulario({
                nombre: mascotaAEditar.nombre,
                especie: mascotaAEditar.especie || 'Perro',
                raza_id: mascotaAEditar.raza_id ? mascotaAEditar.raza_id.toString() : '',
                fecha_nacimiento: mascotaAEditar.fecha_nacimiento ? mascotaAEditar.fecha_nacimiento.split('T')[0] : '',
                dueno_id: mascotaAEditar.dueno_id.toString()
            });
        } else {
            setDatosFormulario(ESTADO_INICIAL);
        }
        setErrores({});
    }, [mascotaAEditar]);

    const validar = () => {
        const nuevosErrores: { [key: string]: string } = {};

        if (!datosFormulario.nombre) nuevosErrores.nombre = 'Requerido';
        if (!datosFormulario.raza_id) nuevosErrores.raza_id = 'Requerido';
        if (!datosFormulario.fecha_nacimiento) nuevosErrores.fecha_nacimiento = 'Requerido';
        if (!datosFormulario.dueno_id) nuevosErrores.dueno_id = 'Requerido';

        setErrores(nuevosErrores);
        return Object.keys(nuevosErrores).length === 0;
    };

    const manejarCambio = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setDatosFormulario(prev => ({ ...prev, [name]: value }));
        if (errores[name]) setErrores(prev => ({ ...prev, [name]: '' }));
    };

    const manejarEnvio = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();

        if (!validar()) return;

        setEstaEnviando(true);
        try {
            const carga = {
                ...datosFormulario,
                raza_id: Number(datosFormulario.raza_id),
                dueno_id: Number(datosFormulario.dueno_id)
            };

            if (mascotaAEditar) {
                await despacho(actualizarMascotaAdmin({ id: mascotaAEditar.id, datos: carga })).unwrap();
            } else {
                await despacho(crearMascotaAdmin(carga)).unwrap();
                setDatosFormulario(ESTADO_INICIAL);
            }
            if (alTenerExito) alTenerExito();
        } catch (error) {
            console.error('Error al guardar mascota:', error);
        } finally {
            setEstaEnviando(false);
        }
    };

    return {
        formData: datosFormulario,
        errors: errores,
        isSubmitting: estaEnviando,
        handleChange: manejarCambio,
        handleSubmit: manejarEnvio,
        reset: () => setDatosFormulario(ESTADO_INICIAL)
    };
};
