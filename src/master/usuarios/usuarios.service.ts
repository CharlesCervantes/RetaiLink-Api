import { Injectable } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsuariosService {
  constructor(private prisma: PrismaService) {}

  create(createUsuarioDto: CreateUsuarioDto) {
    return 'This action adds a new usuario';
  }

  async createAdmin(createUsuarioDto: CreateUsuarioDto) {
    try {
      const query = await this.prisma.usuarios.create({
        data: { 
          ...createUsuarioDto,
          i_status: true,
        }
      });
      return {
        error: 0,
        data: query,
        message: 'Usuario creado correctamente'
      };
    } catch (error) {
      console.error(error); // Agrega logs para depuración
      return {
        error: 1,
        data: error,
        message: 'Error al crear el usuario'
      };
    }
  }
  

  findAll() {
    return `This action returns all usuarios`;
  }

  findOne(id: number) {
    return `This action returns a #${id} usuario`;
  }

  update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
    return `This action updates a #${id} usuario`;
  }

  remove(id: number) {
    return `This action removes a #${id} usuario`;
  }
}
