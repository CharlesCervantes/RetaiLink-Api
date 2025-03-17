import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PromotoresService } from './promotores.service';
import { CreatePromotoreDto } from './dto/create-promotore.dto';
import { UpdatePromotoreDto } from './dto/update-promotore.dto';

@Controller('promotores')
export class PromotoresController {
  constructor(private readonly promotoresService: PromotoresService) {}

  @Post()
  create(@Body() createPromotoreDto: CreatePromotoreDto) {
    return this.promotoresService.create(createPromotoreDto);
  }

  @Get()
  findAll() {
    return this.promotoresService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.promotoresService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePromotoreDto: UpdatePromotoreDto) {
    return this.promotoresService.update(+id, updatePromotoreDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.promotoresService.remove(+id);
  }
}
