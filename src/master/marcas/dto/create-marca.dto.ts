import { IsString } from 'class-validator';

export class CreateMarcaDto {
    @IsString()
    vc_nombre: string;

    @IsString()
    id_cliente: string;
}
