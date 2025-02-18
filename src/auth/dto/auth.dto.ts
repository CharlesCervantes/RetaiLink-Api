import { IsString, MinLength, Matches, IsOptional } from 'class-validator';

export class SignupDto {
  @IsString()
  @MinLength(3, { message: 'El username debe tener al menos 3 caracteres' })
  username: string;

  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  @Matches(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/, {
    message: 'La contraseña debe contener al menos una mayúscula, un número y un carácter especial',
  })
  password: string;

  @IsString()
  @IsOptional()
  nombre?: string;

  @IsString()
  @IsOptional()
  apellido_paterno?: string;

  @IsString()
  @IsOptional()
  apellido_materno?: string;
}

export class SigninDto {
  @IsString()
  username: string;

  @IsString()
  password: string;
}