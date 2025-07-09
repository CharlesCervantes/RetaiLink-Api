export interface PreguntaNegocio {
    id_pregunta_negocio?: number;
    id_pregunta: number;
    id_negocio: number;
    dc_precio: number; // hasta 5 decimales
    b_activo?: boolean;
    dt_registro?: number;
    dt_actualizacion?: number;
}
