import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { LeituraMensagem } from 'generated/prisma';
import { LeituraMensagemService } from 'src/services/leitura_mensagem/leitura_mensagem.service';
import { CreateLeituraMensagemDto, UpdateLeituraMensagemDto } from './leituras_mensagens.dto';
import { User } from 'src/common/decorators/user.decorator';

@Controller('leitura_mensagens')
export class LeituraMensagemController {
  constructor(private readonly leituraMensagemService: LeituraMensagemService) {}

    @Get()
  async getLeituraMensagens(): Promise<LeituraMensagem[]> {
    return this.leituraMensagemService.getAllLeituraMensagens();
  }

  @Post()
  async createLeituraMensagem(
    @Body() data: CreateLeituraMensagemDto,
    @User() user: { sub: number },
  ): Promise<LeituraMensagem> {
    return this.leituraMensagemService.createLeituraMensagem(data, user.sub);
  }

  @Get(':id')
  async getLeituraMensagemById(@Param('id') id: string): Promise<LeituraMensagem | null> {
    return this.leituraMensagemService.getLeituraMensagemById(Number(id));
  }

  @Put(':id')
  async updateLeituraMensagem(
    @Param('id') id: string,
    @Body() data: UpdateLeituraMensagemDto,
    @User() user: { sub: number },
  ): Promise<LeituraMensagem> {
    return this.leituraMensagemService.updateLeituraMensagem(Number(id), data, user.sub);
  }

  @Delete(':id')
  async deleteLeituraMensagem(
    @Param('id') id: string,
    @User() user: { sub: number },
  ): Promise<LeituraMensagem> {
    return this.leituraMensagemService.deleteLeituraMensagem(Number(id), user.sub);
  }
}

