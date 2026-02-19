import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../../../store';
import {
    obtenerServicios,
    crearServicio,
    actualizarServicio,
    eliminarServicio,
    type Servicio
} from '../../../store/slices/serviciosSlice';
import GenericTable, { type Column, type Action } from '../../../components/ui/GenericTable';
import { Badge } from '../../../components/ui/Badge';
import styles from './ServicesPage.module.css';

// DATOS DEL FORMULARIO
interface FormularioServicio {
    nombre: string;
    duracion_minutos: string;
}

// ESTADO INICIAL DEL FORMULARIO
const ESTADO_INICIAL: FormularioServicio = {
    nombre: '',
    duracion_minutos: ''
};

// COMPONENTE PRINCIPAL DE SERVICIOS
const ServicesPage: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { servicios, cargando } = useSelector((state: RootState) => state.servicios);

    const [formulario, setFormulario] = useState<FormularioServicio>(ESTADO_INICIAL);
    const [editando, setEditando] = useState<Servicio | null>(null);

    // CARGAR SERVICIOS AL MONTAR
    useEffect(() => {
        dispatch(obtenerServicios());
    }, [dispatch]);

    // MANEJAR CAMBIOS EN EL FORMULARIO
    const manejarCambio = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormulario(prev => ({ ...prev, [name]: value }));
    };

    // MANEJAR ENVIO DEL FORMULARIO
    const manejarEnvio = async () => {
        if (!formulario.nombre.trim()) return;

        const datos = {
            nombre: formulario.nombre,
            duracion_minutos: formulario.duracion_minutos ? parseInt(formulario.duracion_minutos) : undefined
        };

        if (editando) {
            await dispatch(actualizarServicio({ id: editando.id, datos }));
        } else {
            await dispatch(crearServicio(datos));
        }

        setFormulario(ESTADO_INICIAL);
        setEditando(null);
    };

    // MANEJAR EDICION
    const manejarEdicion = (servicio: Servicio) => {
        setEditando(servicio);
        setFormulario({
            nombre: servicio.nombre,
            duracion_minutos: servicio.duracion_minutos ? String(servicio.duracion_minutos) : ''
        });
    };

    // MANEJAR ELIMINACION
    const manejarEliminacion = async (servicio: Servicio) => {
        if (window.confirm(`¿Eliminar el servicio "${servicio.nombre}"?`)) {
            await dispatch(eliminarServicio(servicio.id));
        }
    };

    // CANCELAR EDICION
    const cancelarEdicion = () => {
        setEditando(null);
        setFormulario(ESTADO_INICIAL);
    };

    // COLUMNAS DE LA TABLA
    const columnas: Column<Servicio>[] = [
        {
            header: 'ID',
            accessor: (s) => <span style={{ fontWeight: 700, color: '#9ca3af' }}>#{s.id}</span>
        },
        {
            header: 'Nombre',
            accessor: (s) => <span className={styles.cellTitle}>{s.nombre}</span>
        },
        {
            header: 'Duración',
            accessor: (s) => (
                <span className={styles.cellSubtitle}>
                    {s.duracion_minutos ? `${s.duracion_minutos} min` : 'No definida'}
                </span>
            )
        }
    ];

    // ACCIONES DE LA TABLA
    const acciones: Action<Servicio>[] = [
        {
            icon: <span className="material-icons" style={{ fontSize: '1.25rem' }}>edit</span>,
            label: 'Editar',
            onClick: manejarEdicion,
            title: 'Editar'
        },
        {
            icon: <span className="material-icons" style={{ fontSize: '1.25rem', color: '#ef4444' }}>delete</span>,
            label: 'Eliminar',
            onClick: manejarEliminacion,
            title: 'Eliminar'
        }
    ];

    return (
        <div>
            {/* ENCABEZADO DE SECCION */}
            <div className={styles.sectionHeader}>
                <div className={styles.titleGroup}>
                    <div className={styles.iconBox}>
                        <span className="material-icons" style={{ fontSize: '1.875rem' }}>miscellaneous_services</span>
                    </div>
                    <div>
                        <h2 className={styles.pageTitle}>Servicios</h2>
                        <p className={styles.pageSubtitle}>Gestión del catálogo de servicios</p>
                    </div>
                </div>
                <Badge text={`${servicios.length} servicios`} variant="primary" />
            </div>

            {/* FORMULARIO INLINE */}
            <div className={styles.inlineFormCard} style={{ borderLeft: editando ? '4px solid #6384FF' : 'none' }}>
                <h3 className={styles.inlineFormTitle} style={{ color: '#6384FF' }}>
                    <span className="material-icons">{editando ? 'edit' : 'add_circle'}</span>
                    {editando ? 'Editar Servicio' : 'Agregar Nuevo Servicio'}
                </h3>
                <div className={styles.inlineFormGrid}>
                    <div className={styles.inlineFormGroup}>
                        <label className={styles.inlineLabel}>Nombre del servicio</label>
                        <input
                            name="nombre"
                            value={formulario.nombre}
                            onChange={manejarCambio}
                            type="text"
                            className={styles.inputField}
                            placeholder="Ej: Consulta general"
                        />
                    </div>
                    <div className={styles.inlineFormGroup}>
                        <label className={styles.inlineLabel}>Duración (minutos)</label>
                        <input
                            name="duracion_minutos"
                            value={formulario.duracion_minutos}
                            onChange={manejarCambio}
                            type="number"
                            className={styles.inputField}
                            placeholder="Ej: 30"
                        />
                    </div>
                </div>
                <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                    <button
                        className={styles.saveButton}
                        style={{ height: 'fit-content', padding: '0.8rem 2rem', borderRadius: '1rem' }}
                        onClick={manejarEnvio}
                    >
                        <span className="material-icons" style={{ fontSize: '1rem', marginRight: '5px' }}>
                            {editando ? 'save' : 'add'}
                        </span>
                        {editando ? 'Actualizar' : 'Agregar Servicio'}
                    </button>
                    {editando && (
                        <button
                            onClick={cancelarEdicion}
                            style={{ padding: '0.8rem', background: 'none', border: '1px solid #ddd', borderRadius: '1rem', cursor: 'pointer' }}
                        >
                            Cancelar
                        </button>
                    )}
                </div>
            </div>

            {/* TABLA DE LISTADO */}
            <div className={styles.tableCard}>
                <div className={styles.tableHeader}>
                    <span className="material-icons" style={{ color: '#6384FF', fontSize: '1.25rem' }}>table_view</span>
                    <h3 className={styles.tableTitle}>Catálogo de Servicios</h3>
                </div>

                <div className={styles.tableContent}>
                    {cargando ? (
                        <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>Cargando servicios...</div>
                    ) : (
                        <GenericTable
                            columns={columnas}
                            data={servicios}
                            actions={acciones}
                            keyExtractor={(s) => s.id}
                            emptyMessage="No hay servicios registrados."
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default ServicesPage;
