interface User {
    id_usuario?: number;
    vc_username: string;
    vc_password: string;
    dt_registro?: number;
    dt_actualizacion?: number;
    b_estatus?: boolean;
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
