import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { Mensagem, Prisma, TipoParticipante } from 'generated/prisma';
import {
  CreateMensagemDto,
  UpdateMensagemDto,
} from 'src/controllers/mensagens/mensagens.dto';
import { decrypt, encrypt } from 'src/helpers/crypt';
import { join } from 'path';
import { ParticipanteConversaService } from '../participante_conversa/participante_conversa.service';

interface CryptResult {
  iv: string;
  content: string;
}

@Injectable()
export class MensagensService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly participanteConversaService: ParticipanteConversaService,
  ) {}

  async getAllMensagens(): Promise<Mensagem[]> {
    const result = await this.prisma.mensagem.findMany({
      include: { anexos: true, remetente: true },
    });

    for (const msg of result) {
      try {
        if (msg.iv && msg.conteudo) {
          const data = {
            content: msg.conteudo,
            iv: msg.iv,
          };
          msg.conteudo = await decrypt(data);
        }
      } catch (error) {
        // Decryption failed, set content to a default error message or handle as needed
        msg.conteudo = 'Error decrypting message';
      }
    }
    return result;
  }

  async getMensagemById(id: number): Promise<Mensagem | null> {
    const msg = await this.prisma.mensagem.findUnique({
      where: { id },
      include: { anexos: true, remetente: true },
    });

    if (!msg) {
      throw new HttpException('Mensagem not found', HttpStatus.NOT_FOUND);
    }

    try {
      if (msg.iv && msg.conteudo) {
        const data = {
          content: msg.conteudo,
          iv: msg.iv,
        };
        msg.conteudo = await decrypt(data);
      }
    } catch (error) {
      // Decryption failed, set content to a default error message or handle as needed
      msg.conteudo = 'Error decrypting message';
    }
    return msg;
  }
  async getMensagensByConversaId(id_conversa: number, currentUserId: number): Promise<Mensagem[]> {
    const msgs = await this.prisma.mensagem.findMany({
      where: { id_conversa },
      include: { 
        anexos: true, 
        remetente: true,
        leituramensagem: { // Include read receipts
          select: {
            id_usuario: true,
            data_hora_leitura: true,
          }
        }
      },
      orderBy: { criado_em: 'desc' },
    });

    const conversas = await this.prisma.conversa.findUnique({
      where: { id_conversa },
      include: {
        participante_conversa: {
          select: {
            id_usuario: true,
          },
        },
      },
    });

    const otherParticipantIds = conversas?.participante_conversa
      .map(p => p.id_usuario)
      .filter(id => id !== currentUserId) ?? [];


    for (const msg of msgs) {
      try {
        if (msg.iv && msg.conteudo) {
          const data = {
            content: msg.conteudo,
            iv: msg.iv,
          };
          msg.conteudo = await decrypt(data);
        }
      } catch (error) {
        // Decryption failed, set content to a default error message or handle as needed
        msg.conteudo = 'Error decrypting message';
      }

      // Determine read status for the current user
      // msg.isRead = msg.leituramensagem.some(
      //   (leitura) => leitura.id_usuario === currentUserId,
      // );

      // Determine if read by at least one other participant
      (msg as any).isReadByAnyOtherParticipant = msg.leituramensagem.some(
        (leitura) => otherParticipantIds.includes(leitura.id_usuario),
      );
    }
    return msgs;
  }

  async createMensagemComAnexos(
    data: CreateMensagemDto,
    anexos: Array<Express.Multer.File>,
    userId: number,
  ): Promise<Mensagem> {
    if (!data.id_conversa) {
      throw new HttpException('Missing conversation id', HttpStatus.BAD_REQUEST);
    }
    
    if (!data.conteudo && (anexos.length === 0)) { // Simplified check
      throw new HttpException(
        'A message must have either content or at least one attachment.',
        HttpStatus.BAD_REQUEST,
      );
    }

    // --- Start: Blocked User Check ---
    const conversation = await this.prisma.conversa.findUnique({
      where: { id_conversa: data.id_conversa },
      include: {
        participante_conversa: {
          select: { id_usuario: true }
        }
      }
    });

    if (!conversation) {
        throw new HttpException('Conversation not found', HttpStatus.NOT_FOUND);
    }

    if (conversation.tipo_conversa === 'individual') {
        const otherParticipant = conversation.participante_conversa.find(
            p => p.id_usuario !== userId
        );

        if (otherParticipant) {
            // Check if sender (userId) is blocked by the other participant
            const isBlocked = await this.prisma.usuarioBloqueado.findUnique({
                where: {
                    id_usuario_id_usuario_bloqueado: { // This is the unique constraint field
                        id_usuario: otherParticipant.id_usuario, // The one who might block
                        id_usuario_bloqueado: userId, // The sender, who might be blocked
                    },
                },
            });

            if (isBlocked) {
                throw new HttpException(
                    'Cannot send message: You are blocked by the other participant in this individual conversation.',
                    HttpStatus.FORBIDDEN,
                );
            }
        }
    }
    // --- End: Blocked User Check ---

    return this.prisma.$transaction(async (prisma) => {
      let encryptedContent: CryptResult | null = null;
      if (data.conteudo) {
        encryptedContent = await encrypt(data.conteudo);
      }

      const mensagemData: Prisma.MensagemCreateInput = {
        remetente: { connect: { id: userId } },
        conversa: { connect: { id_conversa: data.id_conversa } },
        conteudo: encryptedContent ? encryptedContent.content : undefined,
        iv: encryptedContent ? encryptedContent.iv : undefined,
        tipo: data.tipo,
        ...(data.respondendo_a && {
          resposta: { connect: { id: data.respondendo_a } },
        }),
      };

      const mensagem = await prisma.mensagem.create({
        data: mensagemData,
      });

      if (anexos && anexos.length > 0) {
        const anexoCreates = anexos.map((file) =>
          prisma.anexo.create({
            data: {
              id_mensagem: mensagem.id,
              nome_arquivo: file.originalname,
              caminho_arquivo: join('uploads/mensagens_anexos', file.filename),
              tipo: file.mimetype,
              tamanho: file.size,
            },
          }),
        );
        await Promise.all(anexoCreates);
      }

      // Retorna a mensagem completa com os anexos
      return prisma.mensagem.findUniqueOrThrow({
        where: { id: mensagem.id },
        include: { anexos: true, remetente: true },
      });
    });
  }

  async updateMensagem(
    id: number,
    data: UpdateMensagemDto,
    anexos?: Array<Express.Multer.File>,
  ): Promise<Mensagem> {
    const msg = await this.prisma.mensagem.findUnique({ where: { id } });
    if (!msg) {
      throw new HttpException('Mensagem not found', HttpStatus.NOT_FOUND);
    }

    return this.prisma.$transaction(async (prisma) => {
      let encryptedContent: CryptResult | null = null;
      if (data.conteudo) {
        encryptedContent = await encrypt(data.conteudo);
      }

      const mensagem = await prisma.mensagem.update({
        where: { id },
        data: {
          conteudo: encryptedContent?.content,
          iv: encryptedContent?.iv,
          tipo: data.tipo,
          lida: data.lida,
        },
      });

      if (anexos && anexos.length > 0) {
        const anexoCreates = anexos.map((file) =>
          prisma.anexo.create({
            data: {
              id_mensagem: mensagem.id,
              nome_arquivo: file.originalname,
              caminho_arquivo: join('uploads/mensagens_anexos', file.filename),
              tipo: file.mimetype,
              tamanho: file.size,
            },
          }),
        );
        await Promise.all(anexoCreates);
      }

      return prisma.mensagem.findUniqueOrThrow({
        where: { id: mensagem.id },
        include: { anexos: true, remetente: true },
      });
    });
  }

  async deleteMensagem(id: number, requestingUserId: number): Promise<Mensagem> {
    const msg = await this.prisma.mensagem.findUnique({ where: { id } });
    if (!msg) {
      throw new HttpException('Mensagem not found', HttpStatus.NOT_FOUND);
    }

    if (msg.id_remetente !== requestingUserId) {
      const participant =
        await this.participanteConversaService.findParticipant(
          requestingUserId,
          msg.id_conversa,
        );

      if (
        !participant ||
        (participant.tipo_participante !== TipoParticipante.ADMIN &&
          participant.tipo_participante !== TipoParticipante.CRIADOR)
      ) {
        throw new HttpException(
          'You do not have permission to delete this message',
          HttpStatus.FORBIDDEN,
        );
      }
    }

    return this.prisma.mensagem.delete({ where: { id } });
  }
}