import { Module } from '@nestjs/common';
import { StoreService } from './store.service';
import { StoreController } from './store.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  providers: [StoreService],
  controllers: [StoreController],
  imports: [PrismaModule]
})
export class StoreModule {}
