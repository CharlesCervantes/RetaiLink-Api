import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { StoreService } from './store.service';
import { CreateStoreDto, PaginationQueryDto, UpdateStoreDto } from './dto/store.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // Importar el guard

@Controller('api/v1/store')
export class StoreController {
    constructor(private readonly storeService: StoreService) {}

    @UseGuards(JwtAuthGuard) // Protección con JWT
    @Post()
    create(@Body() createStoreDto: CreateStoreDto, @Request() req) {
      console.log(`Usuario autenticado: ${req.user.username}`);
      return this.storeService.create(createStoreDto);
    }
  
    @UseGuards(JwtAuthGuard)
    @Get()
    findAll() {
      return this.storeService.findAll();
    }

    @UseGuards(JwtAuthGuard)
    @Get('pagination')
    findAllPag(@Query() paginationQuery: PaginationQueryDto) {
      const { page, limit } = paginationQuery;
      return this.storeService.findAllPagination(page, limit);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    findOne(@Param('id') id: string) {
      return this.storeService.findOne(id);
    }
  
    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateStoreDto: UpdateStoreDto) {
      return this.storeService.update(id, updateStoreDto);
    }
  
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    remove(@Param('id') id: string) {
      return this.storeService.delete(id);
    }
}
