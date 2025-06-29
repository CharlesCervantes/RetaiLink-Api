interface User {
    id_usuario?: number;
    vc_username: string;
    vc_password: string;
    vc_nombre: string;
    b_activo?: boolean;
    dt_registro?: number;
    dt_actualizacion?: number;
}

interface usuarios_negocios {
    id_usuario_negocio?: number;
    id_usuario: number;
    id_negocio: number;
    dt_registro?: number;
    dt_actualizacion?: number;
    b_estatus?: boolean;
}


export { User, usuarios_negocios };
