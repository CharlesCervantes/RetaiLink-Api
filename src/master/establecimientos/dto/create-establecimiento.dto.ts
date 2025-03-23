import { IsString, IsPhoneNumber } from 'class-validator';

export class CreateEstablecimientoDto {
    @IsString()
    vc_nombre: string;

    @IsString()
    vc_numero_serie: string;

    @IsPhoneNumber('MX')
    vc_telfono: string;

    direccion: {}

}
