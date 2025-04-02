import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PaisesService } from './paises.service';
import { CreatePaiseDto } from './dto/create-paise.dto';
import { UpdatePaiseDto } from './dto/update-paise.dto';
import { UtilsClass } from '../utils/error.utils';

@Controller('paises')
export class PaisesController {
  constructor(private readonly paisesService: PaisesService) {}

  @Post()
  async create(@Body() createPaiseDto: CreatePaiseDto) {
    try{
      const paisExistente = await this.paisesService.findByName(createPaiseDto.vc_nombre);
      if (paisExistente) {
        return UtilsClass.error_pais_ya_existe;
      }

      const pasi_creado = await this.paisesService.create(createPaiseDto);
      return UtilsClass.responseHandler(0, pasi_creado, "Pais creado correctamente");
    } catch (error) {
      console.error(error);
      throw new Error('Error creating country: ' + error.message);
    }
  }

  @Get()
  async findAll() {
    try {
      const listado_paises = await this.paisesService.findAll();
      return UtilsClass.responseHandler(0, listado_paises, "Listado de paises");
    } catch (error) {
      console.error(error);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const pais = await this.paisesService.findOne(id);
      if (!pais) {
        return UtilsClass.error_pais_no_encontrado
      }
      return UtilsClass.responseHandler(0, pais, "Pais encontrado");
    } catch (error) {
      
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updatePaiseDto: UpdatePaiseDto) {
    try {
      const paisExistente = await this.paisesService.findOne(id);
      if (!paisExistente) {
        return UtilsClass.error_pais_no_encontrado
      }

      const paisActualizado = await this.paisesService.update(id, updatePaiseDto);
      return UtilsClass.responseHandler(0, paisActualizado, "Pais actualizado correctamente");
    } catch (error) {
      console.error(error);
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    try {
      return this.paisesService.remove(id);
    } catch (error) {
      console.error(error);
      return UtilsClass.error_pais_no_encontrado;
    }
  }
}
