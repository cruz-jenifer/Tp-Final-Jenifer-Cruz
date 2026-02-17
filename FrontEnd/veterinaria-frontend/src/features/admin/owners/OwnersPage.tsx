import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../../store';
import { fetchDuenos, deleteDueno } from '../../../store/slices/adminSlice';
import { OwnerForm } from './OwnerForm';
import styles from './OwnerForm.module.css'; 


// PAGINA DE GESTION DE DUEÑOS
export const OwnersPage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { owners, loading } = useSelector((state: RootState) => state.admin);

    // ESTADO PARA EDICION
    const [selectedOwner, setSelectedOwner] = useState<any>(null);

    // CARGAR DUEÑOS AL MONTAR
    useEffect(() => {
        dispatch(fetchDuenos());
    }, [dispatch]);

    // MANEJAR EDICION
    const handleEdit = (owner: any) => {
        setSelectedOwner(owner);
        // SCROLL TO TOP
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // CANCELAR EDICION
    const handleCancelEdit = () => {
        setSelectedOwner(null);
    };

    // MANEJAR ELIMINACION
    const handleDelete = async (owner: any) => {
        if (window.confirm(`¿Estás seguro de eliminar al dueño ${owner.nombre} ${owner.apellido}?`)) {
            await dispatch(deleteDueno(owner.id));
        }
    };

    return (
        <div>
            {/* ENCABEZADO DE SECCION */}
            <div className={styles.sectionHeader}>
                <div className={styles.titleGroup}>
                    <div className={styles.iconBox}>
                        <span className="material-icons" style={{ fontSize: '1.875rem' }}>people</span>
                    </div>
                    <div>
                        <h2 className={styles.pageTitle}>Dueños</h2>
                        <p className={styles.pageSubtitle}>Gestión de base de datos de clientes</p>
                    </div>
                </div>
                <span className={styles.activeBadge}>Clientes Activos</span>
            </div>

            {/* FORMULARIO DE REGISTRO (CARD) */}
            <OwnerForm
                ownerToEdit={selectedOwner}
                onCancelEdit={handleCancelEdit}
            />

            {/* TABLA DE LISTADO 
             */}
            <div style={{
                backgroundColor: 'white',
                borderRadius: '1.5rem',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                minHeight: '550px',
                border: '1px solid #f3f4f6'
            }}>
                <div style={{
                    padding: '1.25rem 2rem',
                    borderBottom: '1px solid #f3f4f6',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                }}>
                    <span className="material-icons" style={{ color: '#6384FF', fontSize: '1.25rem' }}>table_view</span>
                    <h3 style={{ fontSize: '0.875rem', fontWeight: '700', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>
                        Directorio
                    </h3>
                </div>

                <div style={{ flexGrow: 1, padding: '0.5rem', overflowX: 'auto' }}>
                    <table style={{ minWidth: '100%', borderCollapse: 'collapse' }}>
                        <thead style={{ backgroundColor: '#f9fafb', position: 'sticky', top: 0, zIndex: 10 }}>
                            <tr>
                                <th style={{ padding: '1rem 2rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '700', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>ID</th>
                                <th style={{ padding: '1rem 2rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '700', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Nombre Completo</th>
                                <th style={{ padding: '1rem 2rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '700', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email</th>
                                <th style={{ padding: '1rem 2rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '700', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Teléfono</th>
                                <th style={{ padding: '1rem 2rem', textAlign: 'right', fontSize: '0.75rem', fontWeight: '700', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>Cargando...</td>
                                </tr>
                            ) : owners.length === 0 ? (
                                <tr>
                                    <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>No hay dueños registrados.</td>
                                </tr>
                            ) : (
                                owners.map((owner: any) => (
                                    <tr key={owner.id} style={{ borderBottom: '1px solid #f9fafb', transition: 'background-color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#eff6ff'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                                        <td style={{ padding: '1.25rem 2rem', whiteSpace: 'nowrap', fontSize: '0.875rem', color: '#9ca3af', fontWeight: '700' }}>
                                            #OWN-{owner.id}
                                        </td>
                                        <td style={{ padding: '1.25rem 2rem', whiteSpace: 'nowrap' }}>
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <div style={{
                                                    height: '2.5rem', width: '2.5rem', borderRadius: '50%',
                                                    backgroundColor: '#dbeafe', color: '#6384FF',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    fontSize: '0.875rem', fontWeight: '700', marginRight: '1rem'
                                                }}>
                                                    {owner.nombre.charAt(0)}{owner.apellido.charAt(0)}
                                                </div>
                                                <div style={{ fontSize: '0.875rem', fontWeight: '700', color: '#374151' }}>
                                                    {owner.nombre} {owner.apellido}
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '1.25rem 2rem', whiteSpace: 'nowrap', fontSize: '0.875rem', color: '#6b7280', fontWeight: '500' }}>
                                            {owner.email}
                                        </td>
                                        <td style={{ padding: '1.25rem 2rem', whiteSpace: 'nowrap', fontSize: '0.875rem', color: '#6b7280', fontWeight: '500' }}>
                                            {owner.telefono}
                                        </td>
                                        <td style={{ padding: '1.25rem 2rem', whiteSpace: 'nowrap', textAlign: 'right' }}>
                                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                                                <button
                                                    onClick={() => handleEdit(owner)}
                                                    style={{ padding: '0.5rem', borderRadius: '50%', color: '#3b82f6', backgroundColor: '#eff6ff', border: 'none', cursor: 'pointer' }}
                                                    title="Editar"
                                                >
                                                    <span className="material-icons" style={{ fontSize: '1.125rem' }}>edit</span>
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(owner)}
                                                    style={{ padding: '0.5rem', borderRadius: '50%', color: '#ef4444', backgroundColor: '#fef2f2', border: 'none', cursor: 'pointer' }}
                                                    title="Eliminar"
                                                >
                                                    <span className="material-icons" style={{ fontSize: '1.125rem' }}>delete</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default OwnersPage;
