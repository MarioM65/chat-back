import { Test, TestingModule } from '@nestjs/testing';
import { LeiturasMensagenssController } from './leituras_mensagens.controller';

describe('LeiturasMensagenssController', () => {
  let controller: LeiturasMensagenssController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LeiturasMensagenssController],
    }).compile();

    controller = module.get<LeiturasMensagenssController>(LeiturasMensagenssController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
