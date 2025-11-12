import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { Conversa } from 'generated/prisma';
import { CreateConversa, UpdateConversa } from 'src/interfaces/conversa';
import { ConversaService } from 'src/services/conversa/conversa.service';

@Controller('conversas')
export class ConversaController {
  constructor(private readonly conversaService: ConversaService) {}

  @Get()
  async getConversas(): Promise<Conversa[]> {
    return this.conversaService.getAllConversas();
  }

  @Post()
  async createConversa(@Body() data: CreateConversa): Promise<Conversa> {
    return this.conversaService.createConversa(data);
  }

  @Get(':id_conversa')
  async getConversaById(@Param('id_conversa') id_conversa: number): Promise<Conversa | null> {
    return this.conversaService.getConversaById(Number(id_conversa));
  }

  @Put(':id_conversa')
  async updateConversa(@Param('id_conversa') id_conversa: number, @Body() data: UpdateConversa): Promise<Conversa> {
    return this.conversaService.updateConversa(Number(id_conversa), data);
  }

  @Delete(':id_conversa')
  async deleteConversa(@Param('id_conversa') id_conversa: number): Promise<Conversa> {
    return this.conversaService.deleteConversa(Number(id_conversa));
  }
}
