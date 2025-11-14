import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateParticipanteConversa, UpdateParticipanteConversa } from '../../interfaces/participante_conversa';

@Injectable()
export class ParticipanteConversaService {
  constructor(private prisma: PrismaService) {}

  async getAllParticipanteConversas() {
    return this.prisma.participanteConversa.findMany();
  }

  async getParticipanteConversaById(id_participante_conversa: number) {
    return this.prisma.participanteConversa.findUnique({
      where: { id_participante_conversa },
    });
  }

  async getParticipanteConversasByConversaId(id_conversa: number) {
    return this.prisma.participanteConversa.findMany({
      where: { id_conversa },
    });
  }

  async getParticipanteConversasByUserId(id_usuario: number) {
    return this.prisma.participanteConversa.findMany({
      where: { id_usuario },
    });
  }

  async createParticipanteConversa(data: CreateParticipanteConversa) {
    return this.prisma.participanteConversa.create({
      data,
    });
  }

  async updateParticipanteConversa(id_participante_conversa: number, data: UpdateParticipanteConversa) {
    return this.prisma.participanteConversa.update({
      where: { id_participante_conversa },
      data,
    });
  }

  async deleteParticipanteConversa(id_participante_conversa: number) {
    return this.prisma.participanteConversa.delete({
      where: { id_participante_conversa },
    });
  }
}
