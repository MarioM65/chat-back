import { Body, Controller, Delete, Get, Param, Post, Put, UploadedFile, UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Mensagem } from 'generated/prisma';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { CreateMensagem } from 'src/interfaces/mensagens';
import { MensagensService } from 'src/services/mensagens/mensagens.service';

@Controller('mensagens')
export class MensagensController {
  constructor(private readonly mensagensService: MensagensService) {}

  @Get()
  async getMensagens(): Promise<Mensagem[]> {
    return this.mensagensService.getAllMensagens();
  }

  @Get(':id')
  async getMensagemById(@Param('id') id: number): Promise<Mensagem | null> {
    return this.mensagensService.getMensagemById(Number(id));
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('arquivo', {
      storage: diskStorage({
        destination: './uploads/mensagens_anexos',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const fileExt = extname(file.originalname);
          cb(null, `${file.fieldname}-${uniqueSuffix}${fileExt}`);
        },
      }),
    }),
  )
  async createMensagem(
    @Body() data: CreateMensagem,
    @UploadedFile() arquivo?: Express.Multer.File,
  ): Promise<Mensagem> {
    if (arquivo) {
      data.tipo = join('uploads/mensagens_anexos', arquivo.filename);
    }
    return this.mensagensService.createMensagem(data);
  }

  @Put(':id')
  @UseInterceptors(
    FileInterceptor('arquivo', {
      storage: diskStorage({
        destination: './uploads/mensagens_anexos',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const fileExt = extname(file.originalname);
          cb(null, `${file.fieldname}-${uniqueSuffix}${fileExt}`);
        },
      }),
    }),
  )
  async updateMensagem(
    @Param('id') id: number,
    @Body() data: Partial<CreateMensagem>,
    @UploadedFile() arquivo?: Express.Multer.File,
  ): Promise<Mensagem> {
    if (arquivo) {
      data.tipo = join('uploads/mensagens_anexos', arquivo.filename);
    }
    return this.mensagensService.updateMensagem(Number(id), data);
  }

  @Delete(':id')
  async deleteMensagem(@Param('id') id: number): Promise<Mensagem> {
    return this.mensagensService.deleteMensagem(Number(id));
  }
}
