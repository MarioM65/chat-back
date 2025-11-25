import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { Notificacao } from 'generated/prisma';
import { NotificacaoService } from 'src/services/notificacao/notificacao.service';
import { CreateNotificacaoDto, UpdateNotificacaoDto } from './notificacoes.dto';
import { User } from 'src/common/decorators/user.decorator';

@Controller('notificacoes')
export class NotificacaoController {
  constructor(private readonly notificacaoService: NotificacaoService) {}

  @Get()
  async getNotificacoes(): Promise<Notificacao[]> {
    return this.notificacaoService.getAllNotificacoes();
  }

   @Post()
  async createNotificacao(
    @Body() data: CreateNotificacaoDto,
    @User() user: { sub: number },
  ): Promise<Notificacao> {
    return this.notificacaoService.createNotificacao(data, user.sub);
  }

  @Get(':id')
  async getNotificacaoById(@Param('id') id: string): Promise<Notificacao | null> {
    return this.notificacaoService.getNotificacaoById(Number(id));
  }

  @Put(':id')
  async updateNotificacao(
    @Param('id') id: string,
    @Body() data: UpdateNotificacaoDto,
    @User() user: { sub: number },
  ): Promise<Notificacao> {
    return this.notificacaoService.updateNotificacao(Number(id), data, user.sub);
  }

    @Delete(':id')
  async deleteNotificacao(
    @Param('id') id: string,
    @User() user: { sub: number },
  ): Promise<Notificacao> {
    return this.notificacaoService.deleteNotificacao(Number(id), user.sub);
  }
}
