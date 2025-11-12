import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { CreateAnexo } from 'src/interfaces/anexos';

@Injectable()
export class AnexosService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllAnexos() {
    return this.prisma.anexo.findMany();
  }

  async getAnexoById(id: number) {
    return this.prisma.anexo.findUnique({ where: { id } });
  }

  async createAnexo(data: CreateAnexo){
    return this.prisma.anexo.create({ data });
  }

  async updateAnexo(id: number, data: Partial<CreateAnexo>) {
    return this.prisma.anexo.update({ where: { id }, data });
  }

  async deleteAnexo(id: number){
    return this.prisma.anexo.delete({ where: { id } });
  }
}
