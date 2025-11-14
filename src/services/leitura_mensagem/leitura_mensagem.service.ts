import { Injectable } from '@nestjs/common';
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
    return this.prisma.leituraMensagem.findUnique({
      where: { id_leitura:id },
      include: {
        mensagem: true,
        usuario: true,
      },
    });
  }

  async createLeituraMensagem(data: CreateLeituraMensagem) {
    const leitura = await this.prisma.leituraMensagem.create({
      data,
    });
    return leitura;
  }

    async updateLeituraMensagem(id: number, data: UpdateLeituraMensagem) {
    return this.prisma.leituraMensagem.update({
      where: { id_leitura:id },
      data,
    });
  }
    async deleteLeituraMensagem(id: number) {
      return this.prisma.leituraMensagem.delete({
        where: {id_leitura:id}
      }
        
      )
    } 


}
