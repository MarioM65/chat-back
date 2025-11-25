import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { CreateAnexo } from 'src/interfaces/anexos';

@Injectable()
export class AnexosService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllAnexos() {
    return this.prisma.anexo.findMany();
  }

  async getAnexoById(id: number) {
    const anexo = await this.prisma.anexo.findUnique({ where: { id } });
    if (!anexo) {
      throw new HttpException('Anexo not found', HttpStatus.NOT_FOUND);
    }
    return anexo;
  }

  async createAnexo(data: CreateAnexo){
    return this.prisma.anexo.create({ data });
  }

  async updateAnexo(id: number, data: Partial<CreateAnexo>) {
    const anexo = await this.prisma.anexo.findUnique({ where: { id } });
    if (!anexo) {
      throw new HttpException('Anexo not found', HttpStatus.NOT_FOUND);
    }
    return this.prisma.anexo.update({ where: { id }, data });
  }

  async deleteAnexo(id: number){
    const anexo = await this.prisma.anexo.findUnique({ where: { id } });
    if (!anexo) {
      throw new HttpException('Anexo not found', HttpStatus.NOT_FOUND);
    }
    return this.prisma.anexo.delete({ where: { id } });
  }
}
