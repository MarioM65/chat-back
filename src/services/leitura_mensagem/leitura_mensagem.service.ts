import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateLeituraMensagem, UpdateLeituraMensagem } from '../../interfaces/leitura_mensagem';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LeituraMensagemService {
  constructor(private prisma: PrismaService) {}

  async getAllLeituraMensagens() {
    return this.prisma.leituraMensagem.findMany({
      include: {
        mensagem: true,
        usuario: true,
      },
    });
  }

    async getLeituraMensagemById(id: number) {
    const leituraMensagem = await this.prisma.leituraMensagem.findUnique({
      where: { id_leitura:id },
      include: {
        mensagem: true,
        usuario: true,
      },
    });
    if (!leituraMensagem) {
      throw new HttpException('LeituraMensagem not found', HttpStatus.NOT_FOUND);
    }
    return leituraMensagem;
  }

  async createLeituraMensagem(data: CreateLeituraMensagem, userId: number) {
    const leitura = await this.prisma.leituraMensagem.create({
      data: {
        ...data,
        id_usuario: userId,
      },
    });
    return leitura;
  }

    async updateLeituraMensagem(id: number, data: UpdateLeituraMensagem, userId: number) {
    const leituraMensagem = await this.prisma.leituraMensagem.findUnique({
      where: { id_leitura:id },
    });
    if (!leituraMensagem) {
      throw new HttpException('LeituraMensagem not found', HttpStatus.NOT_FOUND);
    }
    if (leituraMensagem.id_usuario !== userId) {
      throw new HttpException('Unauthorized to update this LeituraMensagem', HttpStatus.FORBIDDEN);
    }
    return this.prisma.leituraMensagem.update({
      where: { id_leitura:id },
      data,
    });
  }
    async deleteLeituraMensagem(id: number, userId: number) {
      const leituraMensagem = await this.prisma.leituraMensagem.findUnique({
        where: { id_leitura:id }
      });
      if (!leituraMensagem) {
        throw new HttpException('LeituraMensagem not found', HttpStatus.NOT_FOUND);
      }
      if (leituraMensagem.id_usuario !== userId) {
        throw new HttpException('Unauthorized to delete this LeituraMensagem', HttpStatus.FORBIDDEN);
      }
      return this.prisma.leituraMensagem.delete({
        where: {id_leitura:id}
      }
        
      )
    } 


}
