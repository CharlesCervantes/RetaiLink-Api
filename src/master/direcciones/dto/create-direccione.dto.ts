import {  } from 'class-validator';

export class CreateDireccioneDto {
    id_pais: string;
    id_estado: string;
    id_municipio: string;
    id_colonia: string;
    vc_calle: string;
    vc_numero_exterior: string;
    vc_numero_interior: string;
    vc_codigo_postal: string;
}
