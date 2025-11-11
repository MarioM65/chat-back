import { Test, TestingModule } from '@nestjs/testing';
import { UsersBloqueadosController } from './users_bloqueados.controller';

describe('UsersBloqueadosController', () => {
  let controller: UsersBloqueadosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersBloqueadosController],
    }).compile();

    controller = module.get<UsersBloqueadosController>(UsersBloqueadosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
