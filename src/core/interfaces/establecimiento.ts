export interface Establecimiento {
    id_establecimiento?: number;
    vc_nombre: string;
    vc_direccion?: string;
    vc_num_economico?: string; // numero de serie o identificador del establecimiento
    vc_telefono?: string;
    vc_marca?: string; // marca del establecimiento
    i_latitud?: number; // latitud del establecimiento
    i_longitud?: number; // longitud del establecimiento
    b_estatus?: boolean; // estado del establecimiento
    dt_registro?: number; // fecha de registro
    dt_actualizacion?: number; // fecha de actualizacion
}

export interface establecimiento_negocio {
    id_establecimiento_negocio?: number;
    id_establecimiento: number;
    id_negocio: number;
    b_estatus?: boolean; // estado del establecimiento
    dt_registro?: number; // fecha de registro
    dt_actualizacion?: number; // fecha de actualizacion
}