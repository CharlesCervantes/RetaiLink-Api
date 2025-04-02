import { IsString, IsOptional, IsInt } from 'class-validator';

export class CreatePaiseDto {
    @IsString()
    vc_nombre: string;

    @IsOptional()
    @IsString()
    vc_nombre_oficial: string;

    @IsString()
    vc_codigo_iso: string;

    @IsOptional()
    @IsString()
    vc_indicativo: string;

    @IsInt()
    i_codigo_postal: number;
}
