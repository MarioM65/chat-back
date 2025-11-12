import { Test, TestingModule } from '@nestjs/testing';
import { ConversaService } from './conversa.service';

describe('ConversaService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConversaService],
    }).compile();

    service = module.get<ConversaService>(ConversaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
