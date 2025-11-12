import { Injectable } from '@nestjs/common';
import { CreateNotificacao, UpdateNotificacao } from 'src/interfaces/notificacao';
import { PrismaService } from 'src/services/prisma/prisma.service';

@Injectable()
export class NotificacaoService {
  constructor(private prisma: PrismaService) {}

  async getAllNotificacoes() {
    return this.prisma.notificacao.findMany({
      where: { deletado_em: null },
      include: {
        mensagem: true,
        usuario: true,
      },
    });
  }

  async getNotificacaoById(id: number) {
    return this.prisma.notificacao.findUnique({
      where: { id, deletado_em: null },
      include: {
        mensagem: true,
        usuario: true,
      },
    });
  }

  async createNotificacao(data: CreateNotificacao) {
    return this.prisma.notificacao.create({
      data,
      include: {
        mensagem: true,
        usuario: true,
      },
    });
  }

  async updateNotificacao(id: number, data: UpdateNotificacao) {
    return this.prisma.notificacao.update({
      where: { id },
      data,
      include: {
        mensagem: true,
        usuario: true,
      },
    });
  }

  async trashedNotificacoes() {
    return this.prisma.notificacao.findMany({
      where: { deletado_em: { not: null } },
      include: {
        mensagem: true,
        usuario: true,
      },
    });
  }

   async restoreNotificacao(id: number) {
    return this.prisma.notificacao.update({
      where: { id },
      data: { deletado_em: null },
    });
  }

  async deleteNotificacao(id: number) {
    return this.prisma.notificacao.update({
      where: { id },
      data: { deletado_em: new Date() },
    });
  }

  async purgeNotificacao(id: number) {
    return this.prisma.notificacao.delete({
      where: { id },
    });
  }
}
