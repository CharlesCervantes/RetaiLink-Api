import { PartialType } from '@nestjs/mapped-types';
import { CreateLocalizacioneDto } from './create-localizacione.dto';

export class UpdateLocalizacioneDto extends PartialType(CreateLocalizacioneDto) {}
