import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { PromotorDTO } from './dto/promotor.dto';
import { PromotoresService } from './master/promotores/promotores.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private promotoresService: PromotoresService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('promotor')
  async registrarPromotor(@Body() body: PromotorDTO): Promise<void> {
    await this.promotoresService.registrarPromotor(body);
  }
}
