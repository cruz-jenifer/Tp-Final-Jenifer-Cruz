import { ServicioModel } from '../models/servicio.model';

export class ServicioService {

    // OBTENER CATALOGO COMPLETO
    static async getAllServices() {
        return await ServicioModel.findAll();
    }
}