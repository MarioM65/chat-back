import { Injectable } from '@nestjs/common';
import { CreateLeituraMensagem, UpdateLeituraMensagem } from 'src/interfaces/leitura_mensagem';
import { PrismaService } from 'src/services/prisma/prisma.service';

@Injectable()
export class LeituraMensagemService {
  constructor(private prisma: PrismaService) {}

  async getAllLeituraMensagens() {
    return this.prisma.leituraMensagem.findMany({
      where: { deletado_em: null },
      include: {
        mensagem: true,
        usuario: true,
      },
    });
  }

    async getLeituraMensagemById(id: number) {
    return this.prisma.leituraMensagem.findUnique({
      where: { id, deletado_em: null },
      include: {
        mensagem: true,
        usuario: true,
      },
    });
  }

  async createLeituraMensagem(data: CreateLeituraMensagem) {
    return this.prisma.leituraMensagem.create({
      data,
      include: {
        mensagem: true,
        usuario: true,
      },
    });
  }

    async updateLeituraMensagem(id: number, data: UpdateLeituraMensagem) {
    return this.prisma.leituraMensagem.update({
      where: { id },
      data,
      include: {
        mensagem: true,
        usuario: true,
      },
    });
  }

  async trashedLeituraMensagens() {
    return this.prisma.leituraMensagem.findMany({
      where: { deletado_em: { not: null } },
      include: {
        mensagem: true,
        usuario: true,
      },
    });
  }

    async restoreLeituraMensagem(id: number) {
    return this.prisma.leituraMensagem.update({
      where: { id },
      data: { deletado_em: null },
    });
  }

  async deleteLeituraMensagem(id: number) {
    return this.prisma.leituraMensagem.update({
      where: { id },
      data: { deletado_em: new Date() },
    });
  }

  async purgeLeituraMensagem(id: number) {
    return this.prisma.leituraMensagem.delete({
      where: { id },
    });
  }
}
