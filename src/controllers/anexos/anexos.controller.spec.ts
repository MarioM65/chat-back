import { Test, TestingModule } from '@nestjs/testing';
import { AnexosController } from './anexos.controller';
import { AnexosService } from 'src/services/anexos/anexos.service';

describe('AnexosController', () => {
  let controller: AnexosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnexosController],
      providers: [
        {
          provide: AnexosService,
          useValue: {
            getAllAnexos: jest.fn(),
            getAnexoById: jest.fn(),
            createAnexo: jest.fn(),
            updateAnexo: jest.fn(),
            deleteAnexo: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AnexosController>(AnexosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
