import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { StoreModule } from './store/store.module';

@Module({
  imports: [AuthModule, PrismaModule, StoreModule],
  controllers: [AppController, AuthController],
  providers: [AppService],
})
export class AppModule {}
