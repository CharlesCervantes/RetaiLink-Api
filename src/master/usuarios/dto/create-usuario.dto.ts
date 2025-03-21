import { IsString, IsStrongPassword, IsPhoneNumber, IsEnum, IsEmail, IsOptional } from 'class-validator';
import { Roles } from '@prisma/client';

export class CreateUsuarioDto {
    @IsString()
    vc_nombre: string;

    @IsString()
    vc_apellido_paterno: string;

    @IsString()
    vc_apellido_materno: string;

    @IsOptional()
    @IsEmail()
    vc_correo: string;

    @IsStrongPassword(
        {
            minLength: 6,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
        }
    )
    vc_contrasena: string;

    @IsOptional()
    @IsPhoneNumber('MX')
    vc_telefono: string;

    @IsEnum(Roles)
    e_rol: Roles;

    @IsString()
    id_cliente: string;

}
