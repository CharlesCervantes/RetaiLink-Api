import { stringify } from "querystring";

export class UtilsClass {

    /**
     * Los Errores son los siguientes:
     * 0: No hay error
     * 1: Pais existente
     * 2: Pais no encontrado
    */

    static responseHandler(error: number, data: any, message: string) {
        return {
            error: error,
            data: data,
            message: message,
        }
    }

    static error_pais_ya_existe() {
        return this.responseHandler(1, null, "El pais ya existe");
    }

    static error_pais_no_encontrado() {
        return this.responseHandler(2, null, "El pais no fue encontrado");
    }
}