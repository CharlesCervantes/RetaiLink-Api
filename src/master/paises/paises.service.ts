import { Injectable } from '@nestjs/common';
import { CreatePaiseDto } from './dto/create-paise.dto';
import { UpdatePaiseDto } from './dto/update-paise.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PaisesService {
  constructor(private prisma: PrismaService) {}

  async create(createPaiseDto: CreatePaiseDto) {
    const query = await this.prisma.paises.create({
      data: createPaiseDto, 
    });
    return query;
  }

  async findAll() {
    const query = await this.prisma.paises.findMany({});
    return query;
  }

  async findOne(id: string) {
    const query = await this.prisma.paises.findUnique({
      where: { id_pais: id },
    });
    return query;
  }

  async findByName(name: string) {
    const query = await this.prisma.paises.findMany({
      where: { vc_nombre: { contains: name } },
    });
    return query;
  }

 async update(id: string, updatePaiseDto: UpdatePaiseDto) {
    const query = await this.prisma.paises.update({
      where: { id_pais: id },
      data: updatePaiseDto,
    })

    return query;
  }

  async remove(id: string) {
    const query = await this.prisma.paises.delete({
      where: { id_pais: id },
    });

    return query;;
  }
}
