import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateConversa, UpdateConversa } from 'src/interfaces/conversa';
import { Conversa, TipoParticipante } from 'generated/prisma';

@Injectable()
export class ConversaService {
  constructor(private prisma: PrismaService) {}

  async getAllConversas(currentUserId: number) {
    // Only fetch conversations where currentUserId is a participant
    const conversas = await this.prisma.conversa.findMany({
      where: {
        participante_conversa: {
          some: {
            id_usuario: currentUserId,
          },
        },
      },
      include: {
        participante_conversa: {
          include: {
            usuario: true,
          },
        },
      },
    });

    return conversas.map((conversa) =>
      this.processConversaForDisplay(conversa, currentUserId),
    );
  }

  async getConversaById(id_conversa: number, currentUserId: number) {
    const conversa = await this.prisma.conversa.findUnique({
      where: { id_conversa },
      include: {
        participante_conversa: {
          include: {
            usuario: true,
          },
        },
      },
    });
    if (!conversa) {
      throw new HttpException('Conversa not found', HttpStatus.NOT_FOUND);
    }

    // Check if the current user is a participant of this conversation
    const isParticipant = conversa.participante_conversa.some(
      (p) => p.id_usuario === currentUserId,
    );
    if (!isParticipant) {
      throw new HttpException('Unauthorized to access this conversation', HttpStatus.FORBIDDEN);
    }

    return this.processConversaForDisplay(conversa, currentUserId);
  }

  async createConversa(data: CreateConversa, creatorId: number) {
    // Use a transaction to ensure atomicity
    return this.prisma.$transaction(async (prisma) => {
      // 1. Create the conversation
      const conversa = await prisma.conversa.create({
        data: {
          tipo_conversa: data.tipo_conversa,
          nome_conversa: data.nome_conversa,
          foto_conversa: data.foto_conversa,
        },
      });

      // 2. Prepare participant IDs, ensuring uniqueness and including the creator
      let participantIds = new Set<number>();

      // Add creator first as CRIADOR
      participantIds.add(creatorId);

      // Add other participants from data, filtering out duplicates and the creator if already added
      if (data.id_usuarios && data.id_usuarios.length > 0) {
        data.id_usuarios.forEach(id => participantIds.add(id));
      }

      // Convert Set back to Array
      const uniqueParticipantIds = Array.from(participantIds);

      // Ensure all participant IDs actually exist
      const existingUsers = await prisma.usuario.findMany({
        where: {
          id: { in: uniqueParticipantIds }
        },
        select: { id: true }
      });

      const existingUserIds = new Set(existingUsers.map(u => u.id));

      const validParticipantCreates = uniqueParticipantIds
        .filter(id => existingUserIds.has(id)) // Only add existing users
        .map((idUsuario) => ({
          id_conversa: conversa.id_conversa,
          id_usuario: idUsuario,
          // Set creator as CRIADOR, others as MEMBRO
          tipo_participante: idUsuario === creatorId ? TipoParticipante.CRIADOR : TipoParticipante.MEMBRO,
        }));

      if (validParticipantCreates.length === 0) {
        throw new HttpException('No valid participants found for the conversation, including the creator.', HttpStatus.BAD_REQUEST);
      }

      // 3. Create all participants
      await prisma.participanteConversa.createMany({
        data: validParticipantCreates,
      });

      return conversa;
    });
  }


  async updateConversa(id_conversa: number, data: UpdateConversa, requestingUserId: number) { // Added requestingUserId
    const conversa = await this.prisma.conversa.findUnique({
      where: { id_conversa },
      include: {
        participante_conversa: {
          select: { id_usuario: true, tipo_participante: true }
        }
      }
    });
    if (!conversa) {
      throw new HttpException('Conversa not found', HttpStatus.NOT_FOUND);
    }

    // --- Authorization Check for Updating Conversation ---
    if (conversa.tipo_conversa === 'individual') {
        throw new HttpException(
            'Individual conversations cannot be updated via this endpoint.',
            HttpStatus.FORBIDDEN
        );
    }

    // For group conversations, only Admin or Creator can update
    const requestingParticipant = conversa.participante_conversa.find(
        p => p.id_usuario === requestingUserId
    );

    if (!requestingParticipant || (requestingParticipant.tipo_participante !== TipoParticipante.ADMIN && requestingParticipant.tipo_participante !== TipoParticipante.CRIADOR)) {
        throw new HttpException(
            'You do not have permission to update this group conversation.',
            HttpStatus.FORBIDDEN
        );
    }
    // --- End Authorization Check ---

    return this.prisma.conversa.update({
      where: { id_conversa },
      data: {
        tipo_conversa: data.tipo_conversa,
        nome_conversa: data.nome_conversa,
        foto_conversa: data.foto_conversa,
      },
    });
  }

  async deleteConversa(id_conversa: number, requestingUserId: number) { // Added requestingUserId
    const conversa = await this.prisma.conversa.findUnique({
      where: { id_conversa },
      include: {
        participante_conversa: {
          select: { id_usuario: true, tipo_participante: true }
        }
      }
    });

    if (!conversa) {
      throw new HttpException('Conversa not found', HttpStatus.NOT_FOUND);
    }

    // --- Authorization Check for Deleting Conversation ---
    if (conversa.tipo_conversa === 'individual') {
        throw new HttpException(
            'Individual conversations cannot be deleted via this endpoint. Please delete your participation.',
            HttpStatus.FORBIDDEN
        );
    }

    // For group conversations, only Admin or Creator can delete
    const requestingParticipant = conversa.participante_conversa.find(
        p => p.id_usuario === requestingUserId
    );

    if (!requestingParticipant || (requestingParticipant.tipo_participante !== TipoParticipante.ADMIN && requestingParticipant.tipo_participante !== TipoParticipante.CRIADOR)) {
        throw new HttpException(
            'You do not have permission to delete this group conversation.',
            HttpStatus.FORBIDDEN
        );
    }
    // --- End Authorization Check ---

    return this.prisma.conversa.delete({
      where: { id_conversa },
    });
  }

  private processConversaForDisplay(conversa: any, currentUserId: number) {
    let displayName: string;
    let displayImage: string | null = null;

    if (conversa.tipo_conversa === 'grupo') {
      displayName = conversa.nome_conversa || 'Grupo sem Nome';
      displayImage = conversa.foto_conversa;
    } else {
      const otherParticipant = conversa.participante_conversa.find(
        (p: any) => p.id_usuario !== currentUserId,
      );
      displayName = otherParticipant?.usuario?.nome_usuario || 'Conversa Individual';
      displayImage = otherParticipant?.usuario?.foto_perfil;
    }

    return {
      ...conversa,
      display_name: displayName,
      display_image: displayImage,
    };
  }
}