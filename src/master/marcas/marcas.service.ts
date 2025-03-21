import { Injectable } from '@nestjs/common';
import { CreateMarcaDto } from './dto/create-marca.dto';
import { UpdateMarcaDto } from './dto/update-marca.dto';

import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MarcasService {
  constructor(private prisma: PrismaService) {}

  create(createMarcaDto: CreateMarcaDto) {
    return this.prisma.marcas.create({
      data: {
        vc_nombre: createMarcaDto.vc_nombre,
        id_cliente: createMarcaDto.id_cliente
      }
    });
  }

  findAll() {
    return `This action returns all marcas`;
  }

  findOne(id: number) {
    return `This action returns a #${id} marca`;
  }

  update(id: number, updateMarcaDto: UpdateMarcaDto) {
    return `This action updates a #${id} marca`;
  }

  remove(id: number) {
    return `This action removes a #${id} marca`;
  }
}
