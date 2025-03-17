import { PartialType } from '@nestjs/mapped-types';
import { CreatePerfilesPromotorDto } from './create-perfiles_promotor.dto';

export class UpdatePerfilesPromotorDto extends PartialType(CreatePerfilesPromotorDto) {}
