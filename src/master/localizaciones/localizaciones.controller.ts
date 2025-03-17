import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LocalizacionesService } from './localizaciones.service';
import { CreateLocalizacioneDto } from './dto/create-localizacione.dto';
import { UpdateLocalizacioneDto } from './dto/update-localizacione.dto';

@Controller('localizaciones')
export class LocalizacionesController {
  constructor(private readonly localizacionesService: LocalizacionesService) {}

  @Post()
  create(@Body() createLocalizacioneDto: CreateLocalizacioneDto) {
    return this.localizacionesService.create(createLocalizacioneDto);
  }

  @Get()
  findAll() {
    return this.localizacionesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.localizacionesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLocalizacioneDto: UpdateLocalizacioneDto) {
    return this.localizacionesService.update(+id, updateLocalizacioneDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.localizacionesService.remove(+id);
  }
}
