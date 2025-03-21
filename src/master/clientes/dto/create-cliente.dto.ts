import { IsString } from 'class-validator';

export class CreateClienteDto {
  @IsString()
  vc_nombre: string;
}
