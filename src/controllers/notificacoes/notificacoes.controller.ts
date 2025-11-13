import { Body, Controller, Delete, Get, Param, Post, Put, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Notificacao } from 'generated/prisma';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { CreateNotificacao } from 'src/interfaces/notificacao';
import { NotificacaoService } from 'src/services/notificacao/notificacao.service';

@Controller('notificacoes')
export class NotificacaoController {
  constructor(private readonly notificacaoService: NotificacaoService) {}

  @Get()
  async getNotificacoes(): Promise<Notificacao[]> {
    return this.notificacaoService.getAllNotificacoes();
  }

   @Post()
  async createNotificacao(@Body() data: CreateNotificacao): Promise<Notificacao> {
    return this.notificacaoService.createNotificacao(data);
  }

  @Get(':id')
  async getNotificacaoById(@Param('id') id: number): Promise<Notificacao | null> {
    return this.notificacaoService.getNotificacaoById(Number(id));
  }

  @Put(':id')
  async updateNotificacao(@Param('id') id: number, @Body() data: Partial<CreateNotificacao>): Promise<Notificacao> {
    return this.notificacaoService.updateNotificacao(Number(id), data);
  }

    @Delete(':id')
  async deleteNotificacao(@Param('id') id: number): Promise<Notificacao> {
    return this.notificacaoService.deleteNotificacao(Number(id));
  }
}


