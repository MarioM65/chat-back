import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ParticipanteConversa } from 'generated/prisma';
import { CreateParticipanteConversa, UpdateParticipanteConversa } from 'src/interfaces/participante_conversa';
import { ParticipanteConversaService } from 'src/services/participante_conversa/participante_conversa.service';

@Controller('participante_conversas')
export class ParticipanteConversaController {
  constructor(private readonly participanteConversaService: ParticipanteConversaService) {}

  @Get()
  async getParticipanteConversas(): Promise<ParticipanteConversa[]> {
    return this.participanteConversaService.getAllParticipanteConversas();
  }

  @Post()
  async createParticipanteConversa(@Body() data: CreateParticipanteConversa): Promise<ParticipanteConversa> {
    return this.participanteConversaService.createParticipanteConversa(data);
  }

  @Get(':id_participante_conversa')
  async getParticipanteConversaById(@Param('id_participante_conversa') id_participante_conversa: number): Promise<ParticipanteConversa | null> {
    return this.participanteConversaService.getParticipanteConversaById(Number(id_participante_conversa));
  }

  @Get('conversa/:id_conversa')
  async getParticipanteConversasByConversaId(@Param('id_conversa') id_conversa: number): Promise<ParticipanteConversa[]> {
    return this.participanteConversaService.getParticipanteConversasByConversaId(Number(id_conversa));
  }

  @Get('usuario/:id_usuario')
  async getParticipanteConversasByUserId(@Param('id_usuario') id_usuario: number): Promise<ParticipanteConversa[]> {
    return this.participanteConversaService.getParticipanteConversasByUserId(Number(id_usuario));
  }

  @Put(':id_participante_conversa')
  async updateParticipanteConversa(@Param('id_participante_conversa') id_participante_conversa: number, @Body() data: UpdateParticipanteConversa): Promise<ParticipanteConversa> {
    return this.participanteConversaService.updateParticipanteConversa(Number(id_participante_conversa), data);
  }

  @Delete(':id_participante_conversa')
  async deleteParticipanteConversa(@Param('id_participante_conversa') id_participante_conversa: number): Promise<ParticipanteConversa> {
    return this.participanteConversaService.deleteParticipanteConversa(Number(id_participante_conversa));
  }
}
