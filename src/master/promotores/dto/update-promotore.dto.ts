import { PartialType } from '@nestjs/mapped-types';
import { CreatePromotoreDto } from './create-promotore.dto';

export class UpdatePromotoreDto extends PartialType(CreatePromotoreDto) {}
