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
  async getMensagensByConversaId(id_conversa: number): Promise<Mensagem[]> {
    const msgs = await this.prisma.mensagem.findMany({
      where: { id_conversa },
      include: { anexos: true, remetente: true },
      orderBy: { criado_em: 'asc' },
    });

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
    
    if (!data.conteudo && (!anexos || anexos.length === 0)) {
      throw new HttpException(
        'A message must have either content or at least one attachment.',
        HttpStatus.BAD_REQUEST,
      );
    }

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
