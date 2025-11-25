import { Body, Controller, Delete, Get, Param, Post, Put, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Conversa } from 'generated/prisma';
import { ConversaService } from 'src/services/conversa/conversa.service';
import { CreateConversaDto, UpdateConversaDto } from './conversas.dto';
import { join } from 'path';
import * as path from 'path';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { User } from 'src/common/decorators/user.decorator';

@Controller('conversas')
export class ConversaController {
  constructor(private readonly conversaService: ConversaService) {}

  @Get()
  async getConversas(@User() user: { sub: number }): Promise<Conversa[]> {
    return this.conversaService.getAllConversas(user.sub);
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('foto_conversa', {
      storage: diskStorage({
        destination: join(process.cwd(), 'uploads/fotos_conversa'),
        filename: (req, file, cb) => {
          const filename: string =
            path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
          const extension: string = path.parse(file.originalname).ext;
          cb(null, `${filename}${extension}`);
        },
      }),
    }),
  )
  async createConversa(
    @Body() data: CreateConversaDto,
    @UploadedFile() file: Express.Multer.File | undefined,
    @User() user: { sub: number },
  ): Promise<Conversa> {
    if (file) {
      data.foto_conversa = join('uploads/fotos_conversa', file.filename);
    }
    return this.conversaService.createConversa(data, user.sub);
  }

  @Get(':id_conversa')
  async getConversaById(
    @Param('id_conversa') id_conversa: string,
    @User() user: { sub: number },
  ): Promise<Conversa | null> {
    return this.conversaService.getConversaById(Number(id_conversa), user.sub);
  }

  @Put(':id_conversa')
  @UseInterceptors(
    FileInterceptor('foto_conversa', {
      storage: diskStorage({
        destination: join(process.cwd(), 'uploads/fotos_conversa'),
        filename: (req, file, cb) => {
          const filename: string =
            path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
          const extension: string = path.parse(file.originalname).ext;
          cb(null, `${filename}${extension}`);
        },
      }),
    }),
  )
  async updateConversa(
    @Param('id_conversa') id_conversa: string,
    @Body() data: UpdateConversaDto,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<Conversa> {
    if (file) {
      data.foto_conversa = join('uploads/fotos_conversa', file.filename);
    }
    return this.conversaService.updateConversa(Number(id_conversa), data);
  }

  @Delete(':id_conversa')
  async deleteConversa(@Param('id_conversa') id_conversa: string): Promise<Conversa> {
    return this.conversaService.deleteConversa(Number(id_conversa));
  }
}
