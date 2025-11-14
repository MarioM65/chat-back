import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { Mensagem } from 'generated/prisma';
import { CreateMensagem } from 'src/interfaces/mensagens';
import { decrypt, encrypt } from 'src/helpers/crypt';
interface crypt{
  iv:string;
  content: string;
}
interface decrypt{
    content: string;

}
@Injectable()
export class MensagensService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllMensagens(): Promise<Mensagem[]> {
    const result =await this.prisma.mensagem.findMany();
   for(const msg of result){
 if(msg.iv&&msg.conteudo)
  { const data = {
    content: msg.conteudo,
    iv: msg.iv
  };
    msg.conteudo = await decrypt(data);
}
   }
    return result;
  }

  async getMensagemById(id: number): Promise<Mensagem | null> {
    return this.prisma.mensagem.findUnique({ where: { id } });
  }

  async createMensagem(data: CreateMensagem): Promise<Mensagem> {
    if(data.conteudo){
      const result:crypt= await encrypt(data.conteudo);
      data.conteudo=result.content;
      data.iv=result.iv;
    }
    return this.prisma.mensagem.create({ data });
  }

  async updateMensagem(id: number, data: Partial<CreateMensagem>): Promise<Mensagem> {
        if(data.conteudo){
      const result:crypt= await encrypt(data.conteudo);
      data.conteudo=result.content;
      data.iv=result.iv;
    }
    return this.prisma.mensagem.update({ where: { id }, data });
  }

  async deleteMensagem(id: number): Promise<Mensagem> {
    return this.prisma.mensagem.delete({ where: { id } });
  }
}
