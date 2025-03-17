import { PartialType } from '@nestjs/mapped-types';
import { CreateColoniaDto } from './create-colonia.dto';

export class UpdateColoniaDto extends PartialType(CreateColoniaDto) {}
