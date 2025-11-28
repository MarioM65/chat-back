import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateConversa, UpdateConversa } from 'src/interfaces/conversa';
import { Conversa, TipoParticipante } from 'generated/prisma';
import { decrypt } from 'src/helpers/crypt';

@Injectable()
export class ConversaService {
  constructor(private prisma: PrismaService) {}

  async getAllConversas(currentUserId: number) {
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
        mensagens: {
          orderBy: {
            criado_em: 'desc',
          },
          take: 1, // Get only the latest message
          include: {
            remetente: true, // Include remetente for the last message
            anexos: true, // Include anexos for the last message
          },
        },
      },
      orderBy: {
        // Order conversations by the latest message's creation time
        mensagens: {
          _count: 'desc', // This is a trick to order by relation, will need to refine
        }
      }
    });

    const conversasWithDetails = await Promise.all(
      conversas.map(async (conversa) => {
        const unreadCount = await this.prisma.mensagem.count({
          where: {
            id_conversa: conversa.id_conversa,
            leituramensagem: {
              none: {
                id_usuario: currentUserId,
              },
            },
          },
        });
        let lastMessage = conversa.mensagens.length > 0 ? conversa.mensagens[0] : null;
        if (lastMessage?.iv && lastMessage?.conteudo) {
          try {
            const data = {
              content: lastMessage.conteudo,
              iv: lastMessage.iv,
            };
            lastMessage.conteudo = await decrypt(data);
          } catch (error) {
            // Decryption failed, set content to a default error message or handle as needed
            lastMessage.conteudo = 'Error decrypting message';
          }
        }


        return this.processConversaForDisplay(conversa, currentUserId, lastMessage, unreadCount);
      }),
    );

    // Sort by last message date, newest first
    conversasWithDetails.sort((a, b) => {
      const dateA = a.last_message?.criado_em || new Date(0);
      const dateB = b.last_message?.criado_em || new Date(0);
      return dateB.getTime() - dateA.getTime();
    });

    return conversasWithDetails;
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

    return this.processConversaForDisplay(conversa, currentUserId, null, 0); // lastMessage and unreadCount are not needed for a single conversation
  }

  async createConversa(data: CreateConversa, creatorId: number) {
    if (!data.participantes || data.participantes.length === 0) {
      throw new HttpException(
        'Conversations must have participants.',
        HttpStatus.BAD_REQUEST,
      );
    }

    let otherParticipantId: number | undefined;


    // Handle individual conversation logic upfront
    if (data.tipo_conversa === 'individual') {
      // For individual, expect exactly two participants: creator and one other
      if (data.participantes.length !== 2) {
        throw new HttpException(
          'Individual conversations must have exactly two participants (including the creator).',
          HttpStatus.BAD_REQUEST,
        );
      }
      otherParticipantId = data.participantes!.find(
        (p) => p.id_usuario !== creatorId,
      )?.id_usuario;

      if (!otherParticipantId) {
        throw new HttpException(
          'Could not identify the other participant for an individual conversation.',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Find if an individual conversation already exists between creatorId and otherParticipantId
      const existingIndividualConversation = await this.prisma.conversa.findFirst({
        where: {
          tipo_conversa: 'individual',
          AND: [
            {
              participante_conversa: {
                some: { id_usuario: creatorId },
              },
            },
            {
              participante_conversa: {
                some: { id_usuario: otherParticipantId },
              },
            },
            {
              participante_conversa: {
                every: {
                  OR: [
                    { id_usuario: creatorId },
                    { id_usuario: otherParticipantId },
                  ],
                },
              },
            },
          ],
        },
        include: {
          participante_conversa: {
            include: {
              usuario: true,
            },
          },
        },
      });

      if (existingIndividualConversation) {
        return existingIndividualConversation;
      }
    } // Correctly close the if block here

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

      // 2. Prepare participant data including roles
      type ConversationParticipantToCreate = {
        id_conversa: number;
        id_usuario: number;
        tipo_participante: TipoParticipante;
      };

      const uniqueParticipantsMap = new Map<number, TipoParticipante>();

      // Add creator as CRIADOR, ensuring creator's role is always CRIADOR
      uniqueParticipantsMap.set(creatorId, TipoParticipante.CRIADOR);

      // Process other participants from data.participantes
      for (const participantData of data.participantes!) {
        if (participantData.id_usuario === creatorId) {
          // Creator's role is already set as CRIADOR, skip or ensure it remains CRIADOR
          // If the DTO specifies a role for the creator, we ensure CRIADOR takes precedence
          uniqueParticipantsMap.set(creatorId, TipoParticipante.CRIADOR);
        } else {
          uniqueParticipantsMap.set(
            participantData.id_usuario,
            participantData.papel || TipoParticipante.MEMBRO,
          );
        }
      }

      const participantsToCreate: ConversationParticipantToCreate[] = Array.from(
        uniqueParticipantsMap,
      ).map(([id_usuario, tipo_participante]) => ({
        id_conversa: conversa.id_conversa,
        id_usuario,
        tipo_participante,
      }));

      // Ensure all participant IDs actually exist (simplified check for now)
      const uniqueParticipantIds = participantsToCreate.map(p => p.id_usuario);
      const existingUsers = await prisma.usuario.findMany({
        where: {
          id: { in: uniqueParticipantIds }
        },
        select: { id: true }
      });
      const existingUserIds = new Set(existingUsers.map(u => u.id));

      const validParticipants = participantsToCreate.filter(p => existingUserIds.has(p.id_usuario));

      if (validParticipants.length === 0) {
        throw new HttpException('No valid participants found for the conversation, including the creator.', HttpStatus.BAD_REQUEST);
      }

      // 3. Create all participants
      await prisma.participanteConversa.createMany({
        data: validParticipants,
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

  private processConversaForDisplay(conversa: any, currentUserId: number, lastMessage: any | null, unreadCount: number) {
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
      last_message: lastMessage,
      unread_count: unreadCount,
    };
  }
}