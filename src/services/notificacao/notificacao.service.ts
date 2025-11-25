import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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
    const notificacao = await this.prisma.notificacao.findUnique({
      where: { id_notificacao:id },
      include: {
        mensagem: true,
        usuario: true,
      },
    });
    if (!notificacao) {
      throw new HttpException('Notificacao not found', HttpStatus.NOT_FOUND);
    }
    return notificacao;
  }

  async createNotificacao(data: CreateNotificacao, userId: number) {
    return this.prisma.notificacao.create({
      data: {
        ...data,
        id_usuario: userId,
      },
    });
  }

  async updateNotificacao(id: number, data: UpdateNotificacao, userId: number) {
    const notificacao = await this.prisma.notificacao.findUnique({
      where: { id_notificacao:id },
    });
    if (!notificacao) {
      throw new HttpException('Notificacao not found', HttpStatus.NOT_FOUND);
    }
    if (notificacao.id_usuario !== userId) {
      throw new HttpException('Unauthorized to update this Notificacao', HttpStatus.FORBIDDEN);
    }
    return this.prisma.notificacao.update({
      where: { id_notificacao:id },
      data,
    });
  }
  async deleteNotificacao(id:number, userId: number){
    const notificacao = await this.prisma.notificacao.findUnique({
      where:{id_notificacao:id},
    });
    if (!notificacao) {
      throw new HttpException('Notificacao not found', HttpStatus.NOT_FOUND);
    }
    if (notificacao.id_usuario !== userId) {
      throw new HttpException('Unauthorized to delete this Notificacao', HttpStatus.FORBIDDEN);
    }
    return this.prisma.notificacao.delete({
      where:{id_notificacao:id},
    });
  }


}
