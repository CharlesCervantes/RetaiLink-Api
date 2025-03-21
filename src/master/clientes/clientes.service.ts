import { Injectable } from '@nestjs/common';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';

import { PrismaService } from 'src/prisma/prisma.service';


@Injectable()
export class ClientesService {
  constructor(private prisma: PrismaService) {}

  create(createClienteDto: CreateClienteDto) {
    if (!createClienteDto.vc_nombre) {
      throw new Error('El campo nombre es obligatorio');
    }
  
    return this.prisma.clientes.create({
      data: {
        vc_nombre: createClienteDto.vc_nombre
      }
    });
  }
  

  findAll() {
    return this.prisma.clientes.findMany({
      where: {
        b_activo: true
      },
      include: {
        marcas: true,
      }
    });
  }

  findOne(id: string) {
    return this.prisma.clientes.findUnique({
      where: {
        id_cliente: id,
        b_activo: true
      },
      include: {
        marcas: true,
      }
    });
  }

  update(id: string, updateClienteDto: UpdateClienteDto) {
    return this.prisma.clientes.update({
      where: {
        id_cliente: id
      },
      data: {
        vc_nombre: updateClienteDto.vc_nombre
      }
    });
  }

  remove(id: string) {
    return this.prisma.clientes.update({
      where: {
        id_cliente: id
      },
      data: {
        b_activo: false
      }
    });
  }
}
