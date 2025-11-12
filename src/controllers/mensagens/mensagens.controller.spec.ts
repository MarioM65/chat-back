import { Test, TestingModule } from '@nestjs/testing';
import { MensagensController } from './mensagens.controller';
import { MensagensService } from 'src/services/mensagens/mensagens.service';

describe('MensagensController', () => {
  let controller: MensagensController;


  const mockMensagensService = {
    getAllMensagens: jest.fn(),
    getMensagemById: jest.fn(),
    createMensagem: jest.fn(),
    updateMensagem: jest.fn(),
    deleteMensagem: jest.fn(),
    purgeMensagem: jest.fn(),
    trashedMensagens: jest.fn(),
    restoreMensagem: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MensagensController],
      providers: [
        {
          provide: MensagensService,
          useValue: mockMensagensService,
        },
      ],
    }).compile();

    controller = module.get<MensagensController>(MensagensController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });


  it('should call getAllMensagens', async () => {
    await controller.getMensagens();
    expect(mockMensagensService.getAllMensagens).toHaveBeenCalled();
  });
});
