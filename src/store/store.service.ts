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

      async findAllPagination(page = 1, limit = 10) {
        // Asegurarse de que page y limit sean números
        const pageNumber = Number(page);
        const limitNumber = Number(limit);
        
        // Calcular skip como número
        const skip = (pageNumber - 1) * limitNumber;
        
        const [items, totalCount] = await Promise.all([
          this.prisma.store.findMany({
            skip,
            take: limitNumber,
            orderBy: { 
              createdAt: 'desc'  // Asume que tienes un campo createdAt
            }
          }),
          this.prisma.store.count(),
        ]);
    
        const totalPages = Math.ceil(totalCount / limitNumber);
        
        return {
          items,
          meta: {
            totalCount,
            itemsPerPage: limitNumber,
            currentPage: pageNumber,
            totalPages,
            hasNextPage: pageNumber < totalPages,
            hasPreviousPage: pageNumber > 1,
          }
        };
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
