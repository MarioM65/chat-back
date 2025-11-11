import { Test, TestingModule } from '@nestjs/testing';
import { UserBloqueadoService } from './user_bloqueado.service';

describe('UserBloqueadoService', () => {
  let service: UserBloqueadoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserBloqueadoService],
    }).compile();

    service = module.get<UserBloqueadoService>(UserBloqueadoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
