import React from 'react';
import estilos from './RegisterCard.module.css';

interface TarjetaRegistroProps {
    titulo: string;
    icono: string;
    children: React.ReactNode;
}

export const TarjetaRegistro: React.FC<TarjetaRegistroProps> = ({ titulo, icono, children }) => {
    return (
        <div className={estilos.registerCard}>
            <div className={estilos.cardCircleDeco}></div>
            <h3 className={estilos.cardTitle}>
                <span className="material-icons">{icono}</span>
                {titulo}
            </h3>
            {children}
        </div>
    );
};

export default TarjetaRegistro;
