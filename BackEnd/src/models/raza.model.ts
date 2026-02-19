import { pool } from '../config/database';

export interface Raza {
    id: number;
    nombre: string;
    especie_id: number;
}

export class RazaModel {
    static async buscarTodos(): Promise<Raza[]> {
        const [rows] = await pool.query('SELECT * FROM razas ORDER BY nombre ASC');
        return rows as Raza[];
    }

    static async findByEspecie(especieId: number): Promise<Raza[]> {
        const [rows] = await pool.query(
            'SELECT * FROM razas WHERE especie_id = ? ORDER BY nombre ASC',
            [especieId]
        );
        return rows as Raza[];
    }
}
