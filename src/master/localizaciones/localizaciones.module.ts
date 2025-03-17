import { Module } from '@nestjs/common';
import { LocalizacionesService } from './localizaciones.service';
import { LocalizacionesController } from './localizaciones.controller';

@Module({
  controllers: [LocalizacionesController],
  providers: [LocalizacionesService],
})
export class LocalizacionesModule {}
