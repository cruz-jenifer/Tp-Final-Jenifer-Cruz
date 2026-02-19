import React from 'react';
import estilos from './FilterBar.module.css';

interface OpcionFiltro {
    valor: string;
    etiqueta: string;
}

export interface ConfiguracionFiltro {
    nombre: string;
    etiqueta: string;
    opciones: OpcionFiltro[];
    valor: string;
}

interface BarraFiltrosProps {
    filtros: ConfiguracionFiltro[];
    alCambiarFiltro: (nombre: string, valor: string) => void;

    valorBusqueda: string;
    alCambiarBusqueda: (valor: string) => void;
    placeholderBusqueda?: string;
}

const BarraFiltros: React.FC<BarraFiltrosProps> = ({
    filtros,
    alCambiarFiltro,
    valorBusqueda,
    alCambiarBusqueda,
    placeholderBusqueda = 'Buscar...'
}) => {
    return (
        <div className={estilos.filterContainer}>
            {/* FILTROS DESPLEGABLES */}
            {filtros.map((filtro) => (
                <div key={filtro.nombre} className={estilos.filterGroup}>
                    <select
                        className={estilos.selectInput}
                        value={filtro.valor}
                        onChange={(e) => alCambiarFiltro(filtro.nombre, e.target.value)}
                        aria-label={`Filtrar por ${filtro.etiqueta}`}
                    >
                        <option value="">{filtro.etiqueta}</option>
                        {filtro.opciones.map((opt) => (
                            <option key={opt.valor} value={opt.valor}>
                                {opt.etiqueta}
                            </option>
                        ))}
                    </select>
                    <div className={estilos.selectIcon}>
                        <span className="material-icons" style={{ fontSize: '1.25rem' }}>expand_more</span>
                    </div>
                </div>
            ))}

            {/* BARRA DE BÚSQUEDA */}
            <div className={estilos.searchWrapper}>
                <div className={estilos.searchIcon}>
                    <span className="material-icons" style={{ fontSize: '1.25rem' }}>search</span>
                </div>
                <input
                    type="text"
                    className={estilos.searchInput}
                    placeholder={placeholderBusqueda}
                    value={valorBusqueda}
                    onChange={(e) => alCambiarBusqueda(e.target.value)}
                />
            </div>
        </div>
    );
};

export default BarraFiltros;
