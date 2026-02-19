
import { RowDataPacket } from 'mysql2';

export interface Servicio extends RowDataPacket {
    id: number;
    nombre: string;
}
