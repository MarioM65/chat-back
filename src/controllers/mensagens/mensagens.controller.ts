import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Mensagem } from 'generated/prisma';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { User } from 'src/common/decorators/user.decorator';
import { MensagensService } from 'src/services/mensagens/mensagens.service';
import { CreateMensagemDto, UpdateMensagemDto } from './mensagens.dto';

@Controller('mensagens')
export class MensagensController {
  constructor(private readonly mensagensService: MensagensService) {}

  @Get()
  async getMensagens(): Promise<Mensagem[]> {
    return this.mensagensService.getAllMensagens();
  }

  @Get(':id')
  async getMensagemById(@Param('id') id: string): Promise<Mensagem | null> {
    return this.mensagensService.getMensagemById(Number(id));
  }
  @Get('conversa/:id_conversa')
  async getMensagensByConversaId(
    @Param('id_conversa') id_conversa: string,
  ): Promise<Mensagem[]> {
    return this.mensagensService.getMensagensByConversaId(
      Number(id_conversa),
    );
  }

  @Post()
  @UseInterceptors(
    FilesInterceptor('anexos', 10, {
      // Aceita até 10 arquivos no campo 'anexos'
      storage: diskStorage({
        destination: './uploads/mensagens_anexos',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const fileExt = extname(file.originalname);
          cb(null, `${file.fieldname}-${uniqueSuffix}${fileExt}`);
        },
      }),
    }),
  )
  async createMensagem(
    @Body() data: CreateMensagemDto,
    @UploadedFiles() anexos: Array<Express.Multer.File>, // Make anexos non-optional for the interceptor
    @User() user: { sub: number },
  ): Promise<Mensagem> {
    return this.mensagensService.createMensagemComAnexos(data, anexos, user.sub);
  }

  @Put(':id')
  @UseInterceptors(
    FilesInterceptor('anexos', 10, {
      storage: diskStorage({
        destination: './uploads/mensagens_anexos',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const fileExt = extname(file.originalname);
          cb(null, `${file.fieldname}-${uniqueSuffix}${fileExt}`);
        },
      }),
    }),
  )
  async updateMensagem(
    @Param('id') id: string,
    @Body() data: UpdateMensagemDto,
    @UploadedFiles() anexos?: Array<Express.Multer.File>,
  ): Promise<Mensagem> {
    return this.mensagensService.updateMensagem(Number(id), data, anexos);
  }

  @Delete(':id')
  async deleteMensagem(
    @Param('id') id: string,
    @User() user: { sub: number },
  ): Promise<Mensagem> {
    return this.mensagensService.deleteMensagem(Number(id), user.sub);
  }
}
