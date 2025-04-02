import { IsString } from 'class-validator';

export class CreateEstadoDto {
    @IsString()
    id_pais: string;
    
    @IsString()
    vc_nombre: string; 
    
    @IsString()
    vc_clave?: string; 
    
    i_codigo_postal?: number;
}
