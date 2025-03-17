import { Module } from '@nestjs/common';
import { PromotoresService } from './promotores.service';
import { PromotoresController } from './promotores.controller';

@Module({
  controllers: [PromotoresController],
  providers: [PromotoresService],
})
export class PromotoresModule {}
