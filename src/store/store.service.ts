import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateStoreDto, UpdateStoreDto } from './dto/store.dto';

@Injectable()
export class StoreService {
    constructor(
        private prisma: PrismaService
    ){}

    async create(data: CreateStoreDto) {
        return this.prisma.store.create({ data });
      }
    
      async findAll() {
        return this.prisma.store.findMany();
      }
    
      async findOne(id: string) {
        const store = await this.prisma.store.findUnique({ where: { id } });
        if (!store) throw new NotFoundException('Store not found');
        return store;
      }
    
      async update(id: string, data: UpdateStoreDto) {
        return this.prisma.store.update({ where: { id }, data });
      }
    
      async delete(id: string) {
        return this.prisma.store.delete({ where: { id } });
      }
}
