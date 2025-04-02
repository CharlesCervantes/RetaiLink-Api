import { Injectable } from '@nestjs/common';
import { CreateEstadoDto } from './dto/create-estado.dto';
import { UpdateEstadoDto } from './dto/update-estado.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EstadosService {
  constructor(private prisma: PrismaService){}

  async create(createEstadoDto: CreateEstadoDto) {
    const query = await this.prisma.estados.create({
      data: {
        id_pais: createEstadoDto.id_pais,
        vc_nombre: createEstadoDto.vc_nombre,
        vc_clave: createEstadoDto.vc_clave,
        i_codigo_postal: createEstadoDto.i_codigo_postal
      }
    });

    return query;
  }

  async findAll() {
    const query = await this.prisma.estados.findMany({
      where: {
        i_status: true
      },
      include: {
        pais: true,
      }
    });
    return query;
  }

  async findOne(id: string) {
    const query = await this.prisma.estados.findUnique({
      where: {
        id_estado: id,
        i_status: true
      },
      include: {
        pais: true,
      }
    });
    return query;
  }

  update(id: string, updateEstadoDto: UpdateEstadoDto) {
    const query = this.prisma.estados.update({
      where: {
        id_estado: id,
        i_status: true
      },
      data: {
        id_pais: updateEstadoDto.id_pais,
        vc_nombre: updateEstadoDto.vc_nombre,
        vc_clave: updateEstadoDto.vc_clave,
        i_codigo_postal: updateEstadoDto.i_codigo_postal
      }
    });
    return query;
  }

  remove(id: string) {
    const query = this.prisma.estados.update({
      where: {
        id_estado: id
      },
      data: {
        i_status: true
      }
    });
    return query;
  }
}
