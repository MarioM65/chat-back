import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Anexo } from 'generated/prisma';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { AnexosService } from 'src/services/anexos/anexos.service';
import { CreateAnexoDto, UpdateAnexoDto } from './anexos.dto';

@Controller('anexos')
export class AnexosController {
  constructor(private readonly anexosService: AnexosService) {}

  @Get()
  async getAnexos(): Promise<Anexo[]> {
    return this.anexosService.getAllAnexos();
  }

  @Get(':id')
  async getAnexoById(@Param('id') id: string): Promise<Anexo | null> {
    return this.anexosService.getAnexoById(Number(id));
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('arquivo', {
      storage: diskStorage({
        destination: './uploads/anexos',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const fileExt = extname(file.originalname);
          cb(null, `${file.fieldname}-${uniqueSuffix}${fileExt}`);
        },
      }),
    }),
  )
  async createAnexo(
    @Body() data: CreateAnexoDto,
    @UploadedFile() arquivo?: Express.Multer.File,
  ): Promise<Anexo> {
    if (arquivo) {
      data.caminho_arquivo = join('uploads/anexos', arquivo.filename);
      data.nome_arquivo = arquivo.originalname;
    }
    return this.anexosService.createAnexo(data);
  }

  @Put(':id')
  @UseInterceptors(
    FileInterceptor('arquivo', {
      storage: diskStorage({
        destination: './uploads/anexos',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const fileExt = extname(file.originalname);
          cb(null, `${file.fieldname}-${uniqueSuffix}${fileExt}`);
        },
      }),
    }),
  )
  async updateAnexo(
    @Param('id') id: string,
    @Body() data: UpdateAnexoDto,
    @UploadedFile() arquivo?: Express.Multer.File,
  ): Promise<Anexo> {
    if (arquivo) {
      data.caminho_arquivo = join('uploads/anexos', arquivo.filename);
      data.nome_arquivo = arquivo.originalname;
    }
    return this.anexosService.updateAnexo(Number(id), data);
  }

  @Delete(':id')
  async deleteAnexo(@Param('id') id: string): Promise<Anexo> {
    return this.anexosService.deleteAnexo(Number(id));
  }
}
