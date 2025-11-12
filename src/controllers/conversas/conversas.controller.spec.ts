import { Test, TestingModule } from '@nestjs/testing';
import { ConversasController } from './conversas.controller';

describe('ConversasController', () => {
  let controller: ConversasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConversasController],
    }).compile();

    controller = module.get<ConversasController>(ConversasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
