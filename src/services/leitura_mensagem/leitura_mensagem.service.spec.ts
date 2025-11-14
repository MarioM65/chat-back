import { Test, TestingModule } from '@nestjs/testing';
import { LeituraMensagemService } from './leitura_mensagem.service';

describe('LeituraMensagemService', () => {
  let service: LeituraMensagemService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LeituraMensagemService],
    }).compile();

    service = module.get<LeituraMensagemService>(LeituraMensagemService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
