import { Module } from '@nestjs/common';

import { PromotoresService } from './promotores/promotores.service'

@Module({
  imports: [],
  providers: [PromotoresService],
  exports: [PromotoresService],
})
export class MasterModule {}
