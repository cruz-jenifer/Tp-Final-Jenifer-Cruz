import { useState, useCallback } from 'react';
import { useAppDispatch } from '../../../store/hooks';
import { crearTurno } from '../../../store/slices/turnosSlice';

export const useTurnoForm = (enExito?: () => void) => {
    const dispatch = useAppDispatch();
    const [cargando, setCargando] = useState(false);
    const [datos_formulario, setDatosFormulario] = useState({
        mascota_id: '',
        veterinario_id: '',
        fecha: '',
        hora: '',
        motivo_consulta: ''
    });

    const manejarCambio = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setDatosFormulario(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    }, []);

    const manejarEnvio = async (e: React.FormEvent) => {
        e.preventDefault();

        // VALIDAR CAMPOS OBLIGATORIOS
        if (!datos_formulario.mascota_id || !datos_formulario.fecha || !datos_formulario.hora || !datos_formulario.motivo_consulta) {
            alert('POR FAVOR COMPLETE TODOS LOS CAMPOS OBLIGATORIOS');
            return;
        }

        setCargando(true);
        try {
            // NORMALIZAR HORA A FORMATO HH:mm:ss PARA LA BASE DE DATOS
            const hora_formateada = datos_formulario.hora.length === 5 ? `${datos_formulario.hora}:00` : datos_formulario.hora;

            // LOG PARA DEPURACIÓN EN GIT BASH
            console.log("INTENTANDO_RESERVAR_TURNO", { ...datos_formulario, hora: hora_formateada });

            const datos_turno = {
                mascota_id: Number(datos_formulario.mascota_id),
                veterinario_id: Number(datos_formulario.veterinario_id) || 1, // DEFAULT AL PRIMER VETERINARIO SI NO SE SELECCIONA
                servicio_id: 1, // POR DEFECTO CONSULTA GENERAL
                fecha: datos_formulario.fecha,
                hora: hora_formateada,
                motivo_consulta: datos_formulario.motivo_consulta,
                estado: 'pendiente' as const
            };

            await dispatch(crearTurno(datos_turno)).unwrap();
            alert('TURNO RESERVADO CON EXITO');
            if (enExito) enExito();
        } catch (error: any) {
            // EL ERROR YA VIENE DEL BACKEND CON EL CAMPO 'mensaje'
            const mensaje_error = error.mensaje || error.message || 'ERROR DESCONOCIDO';
            alert('ERROR AL RESERVAR TURNO: ' + mensaje_error);
        } finally {
            setCargando(false);
        }
    };

    // LOGICA PARA DESHABILITAR BOTON DE ENVIO
    const es_formulario_valido =
        datos_formulario.mascota_id !== '' &&
        datos_formulario.fecha !== '' &&
        datos_formulario.hora !== '' &&
        datos_formulario.motivo_consulta.trim().length > 0;

    return {
        formData: datos_formulario,
        handleChange: manejarCambio,
        handleSubmit: manejarEnvio,
        cargando,
        es_valido: es_formulario_valido
    };
};
