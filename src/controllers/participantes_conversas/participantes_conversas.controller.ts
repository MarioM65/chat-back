import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ParticipanteConversa, TipoParticipante } from 'generated/prisma';
import { User } from 'src/common/decorators/user.decorator';
import { Roles } from 'src/guards/roles.decorator';
import { RolesGuard } from 'src/guards/roles.guard';
import { ParticipanteConversaService } from 'src/services/participante_conversa/participante_conversa.service';
import {
  CreateParticipanteConversaDto,
  UpdateParticipanteConversaDto,
} from './participantes_conversas.dto';

@Controller('participante_conversas')
export class ParticipanteConversaController {
  constructor(
    private readonly participanteConversaService: ParticipanteConversaService,
  ) {}

  @Get()
  async getParticipanteConversas(): Promise<ParticipanteConversa[]> {
    return this.participanteConversaService.getAllParticipanteConversas();
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles(TipoParticipante.ADMIN, TipoParticipante.CRIADOR)
  async createParticipanteConversa(
    @Body() data: CreateParticipanteConversaDto,
    @User() user: { sub: number },
  ): Promise<ParticipanteConversa> {
    return this.participanteConversaService.createParticipanteConversa(
      data,
      user.sub,
    );
  }

  @Get(':id_participante_conversa')
  async getParticipanteConversaById(
    @Param('id_participante_conversa') id_participante_conversa: string,
  ): Promise<ParticipanteConversa | null> {
    return this.participanteConversaService.getParticipanteConversaById(
      Number(id_participante_conversa),
    );
  }

  @Get('conversa/:id_conversa')
  async getParticipanteConversasByConversaId(
    @Param('id_conversa') id_conversa: string,
  ): Promise<ParticipanteConversa[]> {
    return this.participanteConversaService.getParticipanteConversasByConversaId(
      Number(id_conversa),
    );
  }

  @Get('usuario/:id_usuario')
  async getParticipanteConversasByUserId(
    @Param('id_usuario') id_usuario: string,
  ): Promise<ParticipanteConversa[]> {
    return this.participanteConversaService.getParticipanteConversasByUserId(
      Number(id_usuario),
    );
  }

  @Put(':id_participante_conversa')
  @UseGuards(RolesGuard)
  @Roles(TipoParticipante.ADMIN, TipoParticipante.CRIADOR)
  async updateParticipanteConversa(
    @Param('id_participante_conversa') id_participante_conversa: string,
    @Body() data: UpdateParticipanteConversaDto,
    @User() user: { sub: number },
  ): Promise<ParticipanteConversa> {
    return this.participanteConversaService.updateParticipanteConversa(
      Number(id_participante_conversa),
      data,
      user.sub,
    );
  }

  @Delete(':id_participante_conversa')
  @UseGuards(RolesGuard)
  @Roles(TipoParticipante.ADMIN, TipoParticipante.CRIADOR)
  async deleteParticipanteConversa(
    @Param('id_participante_conversa') id_participante_conversa: string,
    @User() user: { sub: number },
  ): Promise<ParticipanteConversa> {
    return this.participanteConversaService.deleteParticipanteConversa(
      Number(id_participante_conversa),
      user.sub,
    );
  }
}
