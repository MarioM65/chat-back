import { Test, TestingModule } from '@nestjs/testing';
import { participanteconversaService } from './participante_conversa.service';

describe('participanteconversaService', () => {
  let service: participanteconversaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [participanteconversaService],
    }).compile();

    service = module.get<participanteconversaService>(participanteconversaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
