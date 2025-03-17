import { Module } from '@nestjs/common';
import { PerfilesPromotorService } from './perfiles_promotor.service';
import { PerfilesPromotorController } from './perfiles_promotor.controller';

@Module({
  controllers: [PerfilesPromotorController],
  providers: [PerfilesPromotorService],
})
export class PerfilesPromotorModule {}
