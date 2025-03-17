import { Injectable } from '@nestjs/common';
import { CreatePerfilesPromotorDto } from './dto/create-perfiles_promotor.dto';
import { UpdatePerfilesPromotorDto } from './dto/update-perfiles_promotor.dto';

@Injectable()
export class PerfilesPromotorService {
  create(createPerfilesPromotorDto: CreatePerfilesPromotorDto) {
    return 'This action adds a new perfilesPromotor';
  }

  findAll() {
    return `This action returns all perfilesPromotor`;
  }

  findOne(id: number) {
    return `This action returns a #${id} perfilesPromotor`;
  }

  update(id: number, updatePerfilesPromotorDto: UpdatePerfilesPromotorDto) {
    return `This action updates a #${id} perfilesPromotor`;
  }

  remove(id: number) {
    return `This action removes a #${id} perfilesPromotor`;
  }
}
