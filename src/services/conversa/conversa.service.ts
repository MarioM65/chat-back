import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateConversa, UpdateConversa } from 'src/interfaces/conversa';

@Injectable()
export class ConversaService {
  constructor(private prisma: PrismaService) {}

  async getAllConversas() {
    return this.prisma.conversa.findMany();
  }

  async getConversaById(id_conversa: number) {
    return this.prisma.conversa.findUnique({
      where: { id_conversa },
    });
  }

  async createConversa(data: CreateConversa) {
    return this.prisma.conversa.create({
      data,
    });
  }

  async updateConversa(id_conversa: number, data: UpdateConversa) {
    return this.prisma.conversa.update({
      where: { id_conversa },
      data,
    });
  }

  async deleteConversa(id_conversa: number) {
    return this.prisma.conversa.delete({
      where: { id_conversa },
    });
  }
}