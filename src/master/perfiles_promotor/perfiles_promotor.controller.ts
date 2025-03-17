import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PerfilesPromotorService } from './perfiles_promotor.service';
import { CreatePerfilesPromotorDto } from './dto/create-perfiles_promotor.dto';
import { UpdatePerfilesPromotorDto } from './dto/update-perfiles_promotor.dto';

@Controller('perfiles-promotor')
export class PerfilesPromotorController {
  constructor(private readonly perfilesPromotorService: PerfilesPromotorService) {}

  @Post()
  create(@Body() createPerfilesPromotorDto: CreatePerfilesPromotorDto) {
    return this.perfilesPromotorService.create(createPerfilesPromotorDto);
  }

  @Get()
  findAll() {
    return this.perfilesPromotorService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.perfilesPromotorService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePerfilesPromotorDto: UpdatePerfilesPromotorDto) {
    return this.perfilesPromotorService.update(+id, updatePerfilesPromotorDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.perfilesPromotorService.remove(+id);
  }
}
