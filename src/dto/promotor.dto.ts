import {IsStrongPassword, IsPhoneNumber, IsEmail} from 'class-validator';

export class PromotorDTO {
    
    @IsStrongPassword(
        {
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
        },
        {
            message:
                'La contraseña debe tener al menos 8 caracteres, incluyendo al menos una letra mayúscula, una letra minúscula y un número.',
        },
    )
    vc_contrasena: string;

    @IsPhoneNumber('MX')
    vc_telefono: string;

    @IsEmail(
        {},
        {
            message: 'El correo electrónico no es válido.',
        },
    )
    vc_correo: string;
}