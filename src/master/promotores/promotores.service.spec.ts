import { Test, TestingModule } from '@nestjs/testing';
import { PromotoresService } from './promotores.service';

describe('PromotoresService', () => {
  let service: PromotoresService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PromotoresService],
    }).compile();

    service = module.get<PromotoresService>(PromotoresService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
