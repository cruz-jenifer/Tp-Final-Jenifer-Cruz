import React from 'react';
import GenericTable, { type Column, type Action } from '../../../components/ui/GenericTable';
import BarraFiltros from '../../../components/ui/FilterBar';
import EncabezadoPagina from '../../../components/ui/PageHeader';
import styles from './AppointmentsPage.module.css';
import type { Turno } from '../../../types/turno.types';
import { useAppointments } from '../hooks/useAppointments';
import { useAppointmentForm } from '../hooks/useAppointmentForm';
import { FormularioTurnos } from './FormularioTurnos';
import { Avatar } from '../../../components/ui/Avatar';
import { Badge } from '../../../components/ui/Badge';
import { fetchVeterinarios } from '../../../store/slices/adminSlice';
import { useAppDispatch } from '../../../store/hooks';

const PaginaTurnos: React.FC = () => {
    // SISTEMA -> CARGANDO_VISTA_ADMIN_TURNOS
    console.log("SISTEMA -> CARGANDO_VISTA_ADMIN_TURNOS");

    const dispatch = useAppDispatch();

    // Custom Hooks
    const {
        turnos, cargando, vetsOptions, veterinarios,
        searchTerm, setSearchTerm, filterVeterinario, setFilterVeterinario,
        handleCancel, handleDelete, refresh
    } = useAppointments();

    const {
        formRef,
        handleEdit, resetForm
    } = useAppointmentForm();

    // EFECTO REQUERIDO POR EL USUARIO PARA ASEGURAR CARGA DE VETERINARIOS
    React.useEffect(() => {
        dispatch(fetchVeterinarios());
    }, [dispatch]);

    // LOG DE DEPURACION REQUERIDO:
    console.log("ADMIN_VETERINARIOS_CARGADOS:", veterinarios);

    const [appointmentSeleccionado, setAppointmentSeleccionado] = React.useState<any>(null);

    // EL BOTON DE AGENDAR SE HABILITA SI EL FORMULARIO ES VALIDO
    // (formData.veterinario_id ya se valida dentro de useAppointmentForm / es_valido)

    const manejarEditar = (t: Turno) => {
        handleEdit(t);
        setAppointmentSeleccionado(t);
        formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };

    const reestablecerYRecargar = () => {
        setAppointmentSeleccionado(null);
        resetForm();
        refresh();
    };

    // Table Columns Definition
    const columns: Column<Turno>[] = [
        {
            header: 'Turno ID',
            accessor: (t) => <span className={styles.cellId}>#TRN-{t.id}</span>
        },
        {
            header: 'Mascota',
            accessor: (t) => (
                <div className={styles.cellMascota}>
                    <Avatar initials={t.mascota?.charAt(0) || 'M'} variant="blue" size="sm" />
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span className={styles.petName}>{t.mascota}</span>
                        <span className={styles.petIdBadge}>ID: {t.mascota_id}</span>
                    </div>
                </div>
            )
        },
        {
            header: 'Servicio',
            accessor: (t) => <span className={styles.textMuted}>{t.motivo_consulta}</span>
        },
        {
            header: 'Veterinario',
            accessor: (t) => <span className={styles.textGray}>{t.veterinario_nombre ? `Dr. ${t.veterinario_nombre}` : 'Sin asignar'}</span>
        },
        {
            header: 'Fecha/Hora',
            accessor: (t) => (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span className={styles.textMuted}>{t.fecha}</span>
                    <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>{t.hora?.substring(0, 5)} hs</span>
                </div>
            )
        },
        {
            header: 'Estado',
            accessor: (t) => {
                let variant: 'primary' | 'success' | 'warning' | 'danger' | 'info' = 'info';
                if (t.estado === 'confirmado') variant = 'primary';
                if (t.estado === 'completado') variant = 'success';
                if (t.estado === 'cancelado') variant = 'danger';
                if (t.estado === 'pendiente') variant = 'warning';

                return <Badge text={t.estado.toUpperCase()} variant={variant} />;
            }
        }
    ];

    const actions: Action<Turno>[] = [
        {
            icon: <span className="material-icons" style={{ fontSize: '1.125rem' }}>edit</span>,
            label: 'Editar',
            onClick: manejarEditar,
            title: 'Editar Turno'
        },
        {
            icon: <span className="material-icons" style={{ fontSize: '1.125rem' }}>cancel</span>,
            label: 'Cancelar',
            onClick: (t) => handleCancel(t),
            title: 'Cancelar Turno'
        },
        {
            icon: <span className="material-icons" style={{ fontSize: '1.125rem', color: '#ef4444' }}>delete</span>,
            label: 'Eliminar',
            onClick: (t) => handleDelete(t),
            title: 'Eliminar Turno'
        }
    ];

    return (
        <div className={styles.pageContainer}>
            <EncabezadoPagina
                titulo="Citas Médicas"
                subtitulo="Gestión centralizada de turnos"
                icono="calendar_month"
                textoInsignia="Admin"
            />

            <BarraFiltros
                alCambiarFiltro={(nombre, valor) => {
                    if (nombre === 'veterinario') setFilterVeterinario(valor);
                }}
                valorBusqueda={searchTerm}
                alCambiarBusqueda={setSearchTerm}
                placeholderBusqueda="Buscar por mascota, dueño o diagnóstico..."
                filtros={[
                    {
                        nombre: 'veterinario',
                        etiqueta: 'Veterinario',
                        valor: filterVeterinario,
                        opciones: vetsOptions
                    }
                ]}
            />

            <div ref={formRef}>
                <FormularioTurnos
                    turnoAEditar={appointmentSeleccionado}
                    alCancelarEdicion={() => {
                        setAppointmentSeleccionado(null);
                        resetForm();
                    }}
                    alTenerExito={reestablecerYRecargar}
                />
            </div>

            <GenericTable
                columns={columns}
                data={turnos}
                actions={actions}
                keyExtractor={(t) => t.id}
                isLoading={cargando}
                emptyMessage="No se encontraron citas con los filtros aplicados."
                pageSize={10}
            />
        </div>
    );
};

export default PaginaTurnos;
