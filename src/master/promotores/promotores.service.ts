import { Injectable } from '@nestjs/common';
import { CreatePromotoreDto } from './dto/create-promotore.dto';
import { UpdatePromotoreDto } from './dto/update-promotore.dto';

@Injectable()
export class PromotoresService {
  create(createPromotoreDto: CreatePromotoreDto) {
    return 'This action adds a new promotore';
  }

  findAll() {
    return `This action returns all promotores`;
  }

  findOne(id: number) {
    return `This action returns a #${id} promotore`;
  }

  update(id: number, updatePromotoreDto: UpdatePromotoreDto) {
    return `This action updates a #${id} promotore`;
  }

  remove(id: number) {
    return `This action removes a #${id} promotore`;
  }
}
