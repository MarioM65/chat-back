import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateParticipanteConversaDto,
  UpdateParticipanteConversaDto,
} from 'src/controllers/participantes_conversas/participantes_conversas.dto';
import { Prisma, TipoParticipante } from 'generated/prisma';

@Injectable()
export class ParticipanteConversaService {
  constructor(private prisma: PrismaService) {}

  async getAllParticipanteConversas() {
    return this.prisma.participanteConversa.findMany({
      include: { usuario: true, conversa: true },
    });
  }

  async getParticipanteConversaById(id_participante_conversa: number) {
    const participanteConversa =
      await this.prisma.participanteConversa.findUnique({
        where: { id_participante_conversa },
        include: { usuario: true, conversa: true },
      });
    if (!participanteConversa) {
      throw new HttpException(
        'ParticipanteConversa not found',
        HttpStatus.NOT_FOUND,
      );
    }
    return participanteConversa;
  }

  async getParticipanteConversasByConversaId(id_conversa: number) {
    return this.prisma.participanteConversa.findMany({
      where: { id_conversa },
      include: { usuario: true, conversa: true },
    });
  }

  async getParticipanteConversasByUserId(id_usuario: number) {
    return this.prisma.participanteConversa.findMany({
      where: { id_usuario },
      include: { usuario: true, conversa: true },
    });
  }

  async findParticipant(id_usuario: number, id_conversa: number) {
    return this.prisma.participanteConversa.findFirst({
      where: {
        id_usuario,
        id_conversa,
      },
    });
  }

  async createParticipanteConversa(
    data: CreateParticipanteConversaDto,
    requestingUserId: number,
  ) {
    await this.checkAdminPermissions(requestingUserId, data.id_conversa);

    const existingParticipant = await this.prisma.participanteConversa.findFirst(
      {
        where: {
          id_conversa: data.id_conversa,
          id_usuario: data.id_usuario,
        },
      },
    );

    if (existingParticipant) {
      throw new HttpException(
        'User is already in this conversation',
        HttpStatus.CONFLICT,
      );
    }

    return this.prisma.participanteConversa.create({
      data: {
        conversa: { connect: { id_conversa: data.id_conversa } },
        usuario: { connect: { id: data.id_usuario } },
        tipo_participante: data.tipo_participante as TipoParticipante,
      },
    });
  }

  async updateParticipanteConversa(
    id_participante_conversa: number,
    data: UpdateParticipanteConversaDto,
    requestingUserId: number,
  ) {
    const participantToUpdate = await this.getParticipanteConversaById(
      id_participante_conversa,
    );

    await this.checkAdminPermissions(
      requestingUserId,
      participantToUpdate.id_conversa,
    );

    const updateData: Prisma.ParticipanteConversaUpdateInput = {};
    if (data.tipo_participante) {
      updateData.tipo_participante = data.tipo_participante as TipoParticipante;
    }

    return this.prisma.participanteConversa.update({
      where: { id_participante_conversa },
      data: updateData,
    });
  }

  async deleteParticipanteConversa(
    id_participante_conversa: number,
    requestingUserId: number,
  ) {
    const participantToDelete = await this.getParticipanteConversaById(
      id_participante_conversa,
    );

    await this.checkAdminPermissions(
      requestingUserId,
      participantToDelete.id_conversa,
    );

    return this.prisma.participanteConversa.delete({
      where: { id_participante_conversa },
    });
  }

  private async checkAdminPermissions(userId: number, conversaId: number) {
    const requestingParticipant = await this.findParticipant(userId, conversaId);

    if (
      !requestingParticipant ||
      (requestingParticipant.tipo_participante !== TipoParticipante.ADMIN &&
        requestingParticipant.tipo_participante !== TipoParticipante.CRIADOR)
    ) {
      throw new HttpException(
        'You do not have permission to perform this action',
        HttpStatus.FORBIDDEN,
      );
    }
  }
}
