import { Test, TestingModule } from '@nestjs/testing';
import { ParticipantesConversasController } from './participantes_conversas.controller';

describe('ParticipantesConversasController', () => {
  let controller: ParticipantesConversasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ParticipantesConversasController],
    }).compile();

    controller = module.get<ParticipantesConversasController>(ParticipantesConversasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
