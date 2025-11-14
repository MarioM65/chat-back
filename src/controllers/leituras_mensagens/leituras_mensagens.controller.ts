import { Body, Controller, Delete, Get, Param, Post, Put, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { LeituraMensagem } from 'generated/prisma';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { CreateLeituraMensagem } from '../../interfaces/leitura_mensagem';
import { LeituraMensagemService } from 'src/services/leitura_mensagem/leitura_mensagem.service';

@Controller('leitura_mensagens')
export class LeituraMensagemController {
  constructor(private readonly leituraMensagemService: LeituraMensagemService) {}

    @Get()
  async getLeituraMensagens(): Promise<LeituraMensagem[]> {
    return this.leituraMensagemService.getAllLeituraMensagens();
  }

  @Post()
  async createLeituraMensagem(@Body() data: CreateLeituraMensagem): Promise<LeituraMensagem> {
    return this.leituraMensagemService.createLeituraMensagem(data);
  }

  @Get(':id')
  async getLeituraMensagemById(@Param('id') id: number): Promise<LeituraMensagem | null> {
    return this.leituraMensagemService.getLeituraMensagemById(Number(id));
  }

  @Put(':id')
  async updateLeituraMensagem(@Param('id') id: number, @Body() data: Partial<CreateLeituraMensagem>): Promise<LeituraMensagem> {
    return this.leituraMensagemService.updateLeituraMensagem(Number(id), data);
  }

  @Delete(':id')
  async deleteLeituraMensagem(@Param('id') id: number): Promise<LeituraMensagem> {
    return this.leituraMensagemService.deleteLeituraMensagem(Number(id));
  }
}

