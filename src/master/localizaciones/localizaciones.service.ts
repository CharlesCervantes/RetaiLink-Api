import { Injectable } from '@nestjs/common';
import { CreateLocalizacioneDto } from './dto/create-localizacione.dto';
import { UpdateLocalizacioneDto } from './dto/update-localizacione.dto';

@Injectable()
export class LocalizacionesService {
  create(createLocalizacioneDto: CreateLocalizacioneDto) {
    return 'This action adds a new localizacione';
  }

  findAll() {
    return `This action returns all localizaciones`;
  }

  findOne(id: number) {
    return `This action returns a #${id} localizacione`;
  }

  update(id: number, updateLocalizacioneDto: UpdateLocalizacioneDto) {
    return `This action updates a #${id} localizacione`;
  }

  remove(id: number) {
    return `This action removes a #${id} localizacione`;
  }
}
