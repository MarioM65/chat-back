import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { Mensagem } from 'generated/prisma';
import { CreateMensagem } from 'src/interfaces/mensagens';

@Injectable()
export class MensagensService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllMensagens(): Promise<Mensagem[]> {
    return this.prisma.mensagem.findMany();
  }

  async getMensagemById(id: number): Promise<Mensagem | null> {
    return this.prisma.mensagem.findUnique({ where: { id } });
  }

  async createMensagem(data: CreateMensagem): Promise<Mensagem> {
    return this.prisma.mensagem.create({ data });
  }

  async updateMensagem(id: number, data: Partial<CreateMensagem>): Promise<Mensagem> {
    return this.prisma.mensagem.update({ where: { id }, data });
  }

  async deleteMensagem(id: number): Promise<Mensagem> {
    return this.prisma.mensagem.delete({ where: { id } });
  }
}
