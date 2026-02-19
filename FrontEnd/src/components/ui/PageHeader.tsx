import React from 'react';
import estilos from './PageHeader.module.css';

interface EncabezadoPaginaProps {
    titulo: string;
    subtitulo?: string;
    icono: string;
    textoInsignia?: string;
}

export const EncabezadoPagina: React.FC<EncabezadoPaginaProps> = ({ titulo, subtitulo, icono, textoInsignia }) => {
    return (
        <div className={estilos.sectionHeader}>
            <div className={estilos.titleGroup}>
                <div className={estilos.iconBox}>
                    <span className="material-icons" style={{ fontSize: '1.875rem' }}>{icono}</span>
                </div>
                <div>
                    <h2 className={estilos.pageTitle}>{titulo}</h2>
                    {subtitulo && <p className={estilos.pageSubtitle}>{subtitulo}</p>}
                </div>
            </div>
            {textoInsignia && (
                <span className={estilos.activeBadge}>
                    {textoInsignia}
                </span>
            )}
        </div>
    );
};

export default EncabezadoPagina;
