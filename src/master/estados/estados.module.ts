import { Module } from '@nestjs/common';
import { EstadosService } from './estados.service';
import { EstadosController } from './estados.controller';
import { PaisesModule } from '../paises/paises.module';

@Module({
  imports: [PaisesModule],
  controllers: [EstadosController],
  providers: [EstadosService],
})
export class EstadosModule {}
