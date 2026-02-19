import { useState, useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { crearTurno, actualizarTurno, verificarDisponibilidad, obtenerAgendaAdmin } from '../../../store/slices/turnosSlice';
import type { Turno } from '../../../types/turno.types';

// INTERFAZ DE DATOS DEL FORMULARIO EN ESPAÑOL
interface DatosFormularioTurno {
    dueno_id: string;
    mascota_id: string;
    veterinario_id: string;
    servicio_id: string;
    fecha: string;
    hora: string;
    motivo_consulta: string;
}

const ESTADO_INICIAL: DatosFormularioTurno = {
    dueno_id: '',
    mascota_id: '',
    veterinario_id: '',
    servicio_id: '1',
    fecha: '',
    hora: '',
    motivo_consulta: ''
};

export const useAppointmentForm = (turnoAEditar?: Turno | null, alTenerExito?: () => void) => {
    const dispatch = useAppDispatch();
    const { duenos, mascotas, veterinarios } = useAppSelector((state) => state.admin);
    const referencia_formulario = useRef<HTMLDivElement>(null);

    const [datos_formulario, setDatosFormulario] = useState<DatosFormularioTurno>(ESTADO_INICIAL);
    const [errores, setErrores] = useState<{ [key: string]: string }>({});
    const [esta_disponible, setEstaDisponible] = useState<boolean | null>(null);
    const [verificando_disponibilidad, setVerificandoDisponibilidad] = useState(false);
    const [editando, setEditando] = useState(false);
    const [id_edicion, setIdEdicion] = useState<number | null>(null);

    // CARGAR DATOS SI ES EDICION
    useEffect(() => {
        if (turnoAEditar) {
            setDatosFormulario({
                dueno_id: turnoAEditar.dueno_id?.toString() || '',
                mascota_id: turnoAEditar.mascota_id?.toString() || '',
                veterinario_id: turnoAEditar.veterinario_id?.toString() || '',
                servicio_id: turnoAEditar.servicio_id?.toString() || '1',
                fecha: turnoAEditar.fecha || '',
                hora: turnoAEditar.hora || '',
                motivo_consulta: turnoAEditar.motivo_consulta || ''
            });
            setEditando(true);
            setIdEdicion(turnoAEditar.id);
        } else {
            setDatosFormulario(ESTADO_INICIAL);
            setEditando(false);
            setIdEdicion(null);
        }
        setErrores({});
    }, [turnoAEditar]);

    // CHEQUEO PREDICTIVO DE DISPONIBILIDAD
    useEffect(() => {
        const verificar = async () => {
            if (datos_formulario.veterinario_id && datos_formulario.fecha && datos_formulario.hora) {
                // Si la hora es la misma que la del turno editado, asumimos disponible
                if (editando && turnoAEditar &&
                    datos_formulario.fecha === turnoAEditar.fecha &&
                    datos_formulario.hora === turnoAEditar.hora &&
                    Number(datos_formulario.veterinario_id) === turnoAEditar.veterinario_id) {
                    setEstaDisponible(true);
                    return;
                }

                setVerificandoDisponibilidad(true);
                setErrores(prev => ({ ...prev, disponibilidad: '' }));

                try {
                    const resultado = await dispatch(verificarDisponibilidad({
                        veterinario_id: Number(datos_formulario.veterinario_id),
                        fecha: datos_formulario.fecha,
                        hora: datos_formulario.hora
                    })).unwrap();

                    setEstaDisponible(resultado);
                    if (!resultado) {
                        setErrores(prev => ({ ...prev, disponibilidad: 'Horario no disponible' }));
                    }
                } catch {
                    setEstaDisponible(null);
                } finally {
                    setVerificandoDisponibilidad(false);
                }
            } else {
                setEstaDisponible(null);
            }
        };

        const id_espera = setTimeout(verificar, 500);
        return () => clearTimeout(id_espera);
    }, [datos_formulario.veterinario_id, datos_formulario.fecha, datos_formulario.hora, dispatch, editando, turnoAEditar]);

    const manejarCambio = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setDatosFormulario(prev => ({ ...prev, [name]: value }));
        if (errores[name]) setErrores(prev => ({ ...prev, [name]: '' }));
    };

    const validarFormulario = () => {
        const nuevos_errores: { [key: string]: string } = {};

        if (!datos_formulario.mascota_id) nuevos_errores.mascota_id = 'Requerido';
        if (!datos_formulario.veterinario_id) nuevos_errores.veterinario_id = 'Requerido';
        if (!datos_formulario.fecha) nuevos_errores.fecha = 'Requerido';
        if (!datos_formulario.hora) nuevos_errores.hora = 'Requerido';
        if (!editando && !datos_formulario.dueno_id) nuevos_errores.dueno_id = 'Requerido';
        if (esta_disponible === false) nuevos_errores.disponibilidad = 'Horario ocupado';

        setErrores(nuevos_errores);
        return Object.keys(nuevos_errores).length === 0;
    };

    const limpiarFormulario = () => {
        setDatosFormulario(ESTADO_INICIAL);
        setEstaDisponible(null);
        setEditando(false);
        setIdEdicion(null);
        setErrores({});
    };

    const manejarEnvio = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!validarFormulario()) return;

        try {
            if (editando && id_edicion) {
                const datos_actualizar = {
                    mascota_id: Number(datos_formulario.mascota_id),
                    veterinario_id: Number(datos_formulario.veterinario_id),
                    servicio_id: Number(datos_formulario.servicio_id),
                    fecha: datos_formulario.fecha,
                    hora: datos_formulario.hora,
                    motivo_consulta: datos_formulario.motivo_consulta
                };
                await dispatch(actualizarTurno({ id: id_edicion, datos: datos_actualizar })).unwrap();
            } else {
                const datos_turno = {
                    dueno_id: Number(datos_formulario.dueno_id),
                    mascota_id: Number(datos_formulario.mascota_id),
                    veterinario_id: Number(datos_formulario.veterinario_id),
                    servicio_id: Number(datos_formulario.servicio_id),
                    fecha: datos_formulario.fecha,
                    hora: datos_formulario.hora,
                    motivo_consulta: datos_formulario.motivo_consulta
                };
                await dispatch(crearTurno(datos_turno)).unwrap();
            }

            if (alTenerExito) alTenerExito();
            limpiarFormulario();
            dispatch(obtenerAgendaAdmin(undefined));
        } catch (error) {
            console.error('Error al guardar turno:', error);
        }
    };

    const manejarEdicion = (turno: Turno) => {
        setDatosFormulario({
            dueno_id: turno.dueno_id?.toString() || '',
            mascota_id: turno.mascota_id?.toString() || '',
            veterinario_id: turno.veterinario_id?.toString() || '',
            servicio_id: turno.servicio_id?.toString() || '1',
            fecha: turno.fecha || '',
            hora: turno.hora || '',
            motivo_consulta: turno.motivo_consulta || ''
        });
        setEditando(true);
        setIdEdicion(turno.id);
        setErrores({});
        referencia_formulario.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };

    // LOGICA PARA DESHABILITAR BOTON DE ENVIO
    const es_valido =
        datos_formulario.mascota_id !== '' &&
        datos_formulario.veterinario_id !== '' &&
        datos_formulario.fecha !== '' &&
        datos_formulario.hora !== '' &&
        (editando || datos_formulario.dueno_id !== '') &&
        esta_disponible !== false;

    return {
        formData: datos_formulario,
        errors: errores,
        isAvailable: esta_disponible,
        checkingAvailability: verificando_disponibilidad,
        isEditing: editando,
        formRef: referencia_formulario,
        duenos,
        mascotas,
        veterinarios,
        handleChange: manejarCambio,
        handleSubmit: manejarEnvio,
        handleEdit: manejarEdicion,
        resetForm: limpiarFormulario,
        es_valido
    };
};
