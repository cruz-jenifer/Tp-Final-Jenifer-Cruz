import React from 'react';
import styles from './FilterBar.module.css';

interface FilterOption {
    value: string;
    label: string;
}

export interface FilterConfig {
    name: string;
    label: string; // Placeholder or Label
    options: FilterOption[];
    value: string;
}

interface FilterBarProps {
    filters: FilterConfig[];
    onFilterChange: (name: string, value: string) => void;

    searchValue: string;
    onSearchChange: (value: string) => void;
    searchPlaceholder?: string;
}

const FilterBar: React.FC<FilterBarProps> = ({
    filters,
    onFilterChange,
    searchValue,
    onSearchChange,
    searchPlaceholder = 'Buscar...'
}) => {
    return (
        <div className={styles.filterContainer}>
            {/* DROPDOWN FILTERS */}
            {filters.map((filter) => (
                <div key={filter.name} className={styles.filterGroup}>
                    <select
                        className={styles.selectInput}
                        value={filter.value}
                        onChange={(e) => onFilterChange(filter.name, e.target.value)}
                        aria-label={`Filtrar por ${filter.label}`}
                    >
                        <option value="">{filter.label}</option>
                        {filter.options.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                    <div className={styles.selectIcon}>
                        <span className="material-icons" style={{ fontSize: '1.25rem' }}>expand_more</span>
                    </div>
                </div>
            ))}

            {/* SEARCH BAR */}
            <div className={styles.searchWrapper}>
                <div className={styles.searchIcon}>
                    <span className="material-icons" style={{ fontSize: '1.25rem' }}>search</span>
                </div>
                <input
                    type="text"
                    className={styles.searchInput}
                    placeholder={searchPlaceholder}
                    value={searchValue}
                    onChange={(e) => onSearchChange(e.target.value)}
                />
            </div>
        </div>
    );
};

export default FilterBar;
