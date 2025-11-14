import { Injectable } from '@nestjs/common';
import { CreateNotificacao, UpdateNotificacao } from '../../interfaces/notificacao';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificacaoService {
  constructor(private prisma: PrismaService) {}

  async getAllNotificacoes() {
    return this.prisma.notificacao.findMany({
      include: {
        mensagem: true,
        usuario: true,
      },
    });
  }

  async getNotificacaoById(id: number) {
    return this.prisma.notificacao.findUnique({
      where: { id_notificacao:id },
      include: {
        mensagem: true,
        usuario: true,
      },
    });
  }

  async createNotificacao(data: CreateNotificacao) {
    return this.prisma.notificacao.create({
      data,
    });
  }

  async updateNotificacao(id: number, data: UpdateNotificacao) {
    return this.prisma.notificacao.update({
      where: { id_notificacao:id },
      data,
    });
  }
  async deleteNotificacao(id:number){
    return this.prisma.notificacao.delete({
      where:{id_notificacao:id},
    });
  }


}
